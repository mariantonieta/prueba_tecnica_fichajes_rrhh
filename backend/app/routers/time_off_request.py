from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.core.exceptions import  forbidden, not_found

from app.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.time_off_request import TimeOffRequest
from app.schemas.time_off_request import TimeOffRequestCreate, TimeOffRequestOut
from app.schemas.enum import UserRole, LeaveStatusEnum

router = APIRouter(prefix="/time-off-requests", tags=["Time Off Requests"])

@router.post("/", response_model=TimeOffRequestOut)
def create_time_off_request(
    request: TimeOffRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_request = TimeOffRequest(
        user_id=current_user.id,
        start_date=request.start_date,
        end_date=request.end_date,
        leave_type=request.leave_type,
        days_requested=request.days_requested,
        reason=request.reason,
        status=LeaveStatusEnum.PENDING
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

@router.get("/", response_model=List[TimeOffRequestOut])
def get_all_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role is None or current_user.role.name != UserRole.RRHH:
        raise forbidden("Not authorized")
    return db.query(TimeOffRequest).all()

@router.get("/user/{user_id}", response_model=List[TimeOffRequestOut])
def get_requests_by_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role is None or (current_user.role.name != UserRole.RRHH and current_user.id != user_id):
        raise forbidden("Not authorized")
    records = db.query(TimeOffRequest).filter(TimeOffRequest.user_id == user_id).all()
    return records

@router.patch("/{request_id}/review", response_model=TimeOffRequestOut)
def review_request(
    request_id: UUID,
    status: LeaveStatusEnum,
    comment: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role is None or current_user.role.name != UserRole.RRHH:
        raise forbidden("Not authorized")
    
    request_obj = db.query(TimeOffRequest).filter(TimeOffRequest.id == request_id).first()
    if not request_obj:
        raise not_found("No requests found for this user")
    
    request_obj.status = status
    request_obj.reviewed_by = current_user.id
    request_obj.review_comment = comment
    db.commit()
    db.refresh(request_obj)
    return request_obj
