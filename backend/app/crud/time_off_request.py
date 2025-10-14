from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional


from app.models.time_off_request import TimeOffRequest
from app.models.user import User
from app.schemas.time_off_request import TimeOffRequestUpdate
from app.core.exceptions import bad_request
from app.crud.leave_balance import deduct_days


def _attach_user_full_name(request_obj: TimeOffRequest, db: Session) -> None:
    if request_obj.user:
        request_obj.user_full_name = request_obj.user.full_name
    else:
        user = db.query(User).filter(User.id == request_obj.user_id).first()
        request_obj.user_full_name = user.full_name if user else None


def get_request(db: Session, request_id: UUID) -> Optional[TimeOffRequest]:
    req = db.query(TimeOffRequest).filter(TimeOffRequest.id == request_id).first()
    if req:
        _attach_user_full_name(req, db)
    return req


def create_request(db: Session, data: dict) -> TimeOffRequest:
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    if start_date > end_date:
        raise bad_request("Start date cannot be after end date")

    data["days_requested"] = float((end_date - start_date).days + 1)

    new_request = TimeOffRequest(**data)
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    _attach_user_full_name(new_request, db)
    return new_request


def update_request(db: Session, request_obj: TimeOffRequest, data: TimeOffRequestUpdate) -> TimeOffRequest:
    previous_status = request_obj.status

    for key, value in data.dict(exclude_unset=True).items():
        setattr(request_obj, key, value)

    db.commit()
    db.refresh(request_obj)

    if previous_status != "APPROVED" and request_obj.status == "APPROVED":
        leave_type = getattr(request_obj, "leave_type", "VACATION")
        try:
            deduct_days(db=db, user_id=request_obj.user_id, leave_type=leave_type, days_taken=request_obj.days_requested)
        except Exception as e:
            db.rollback()
            raise bad_request(f"Error al descontar días: {str(e)}")

    _attach_user_full_name(request_obj, db)
    return request_obj


def list_requests(db: Session):
    requests = db.query(TimeOffRequest).all()
    for r in requests:
        _attach_user_full_name(r, db)
    return requests


def list_requests_by_user(db: Session, user_id: UUID):
    requests = db.query(TimeOffRequest).filter(TimeOffRequest.user_id == user_id).all()
    for r in requests:
        _attach_user_full_name(r, db)
    return requests
