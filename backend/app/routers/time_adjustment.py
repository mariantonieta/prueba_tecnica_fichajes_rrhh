from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.time_adjustment import TimeAjustmentCreate, TimeAdjustmentOut
from app.services.time_adjustment import (
    create_time_adjustment,
    get_adjustments_by_user,
    get_adjustment_by_id,
    review_adjustment,
    TimeAdjustment
)
from app.schemas.enum import UserRole, AdjustmentStatusEnum
from app.core.exceptions import bad_request, forbidden, not_found

router = APIRouter(prefix="/time-adjustments", tags=["Time Adjustments"])


@router.post("/", response_model=TimeAdjustmentOut)
def create_adjustment(
    adjustment: TimeAjustmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_time_adjustment(db, user_id=current_user.id, adjustment=adjustment)
    except Exception as e:
        raise bad_request(str(e))
    
@router.get("/", response_model=List[TimeAdjustmentOut])
def get_adjustments(
    skip: int = Query(0, ge=0, description="Nomero de registros a omitir"),
    limit: int = Query(10, ge=1, le=100, description="Número máximo de registros a retornar"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    query = db.query(TimeAdjustment)

    if getattr(current_user.role, "name", None) != UserRole.RRHH.value:
        query = query.filter(TimeAdjustment.user_id == current_user.id)

    adjustments = query.offset(skip).limit(limit).all()

    return [
        TimeAdjustmentOut(
            id=a.id,
            user_id=a.user_id,
            full_name=a.user.full_name if a.user else a.user_id,  
            time_record_id=a.time_record_id,
            status=a.status,
            reviewed_by=a.reviewed_by,
            review_comment=a.review_comment,
            adjusted_timestamp=a.adjusted_timestamp,
            adjusted_type=a.adjusted_type,
            reason=a.reason,
        )
        for a in adjustments
    ]
    
@router.get("/{adjustment_id}", response_model=TimeAdjustmentOut)
def get_adjustment(
    adjustment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    adjustment = get_adjustment_by_id(db, adjustment_id)
    if not adjustment:
        raise not_found("Adjustment not found")

    if getattr(current_user.role, "name", None) != UserRole.RRHH.value and adjustment.user_id != current_user.id:
        raise forbidden("You do not have permission to view this adjustment")

    return adjustment


@router.get("/user/{user_id}", response_model=List[TimeAdjustmentOut])
def get_adjustments_for_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if getattr(current_user.role, "name", None) != UserRole.RRHH.value:
        raise forbidden("Only RRHH can access other users' adjustments")
    return get_adjustments_by_user(db, user_id=user_id)

@router.put("/{adjustment_id}/review", response_model=TimeAdjustmentOut)
def review_adjustment_response(
    adjustment_id: UUID,
    new_status: str = Query(..., description="APPROVED o REJECTED"),
    review_comment: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if getattr(current_user.role, "name", None) != UserRole.RRHH.value:
        raise forbidden("Only RRHH can review adjustments")

    if new_status not in [s.value for s in AdjustmentStatusEnum]:
        raise bad_request("Invalid status provided")

    reviewed = review_adjustment(
        db,
        adjustment_id=adjustment_id,
        reviewer_id=current_user.id,
        status=AdjustmentStatusEnum(new_status),
        review_comment=review_comment 
    )

    if not reviewed:
        raise not_found("Adjustment not found")

    return reviewed  