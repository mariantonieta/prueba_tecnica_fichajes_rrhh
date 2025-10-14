from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.time_adjustment import TimeAjustmentCreate, TimeAdjustmentOut
from app.crud.time_adjustment import (
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if getattr(current_user.role, "name", None) == UserRole.RRHH.value:
        return db.query(TimeAdjustment).all()
    return get_adjustments_by_user(db, user_id=current_user.id)


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

    adjustment = get_adjustment_by_id(db, adjustment_id)
    if not adjustment:
        raise not_found("Adjustment not found")

    return review_adjustment(
        db,
        adjustment_id=adjustment_id,
        reviewer_id=current_user.id,
        status=AdjustmentStatusEnum(new_status),
        comment=review_comment
    )
