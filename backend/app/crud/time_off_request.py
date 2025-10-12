from sqlalchemy.orm import Session
from uuid import UUID
from app.models.time_off_request import TimeOffRequest
from app.schemas.time_off_request import TimeOffRequestCreate

def create_time_off_request(db: Session, user_id: UUID, request: TimeOffRequestCreate):
    new_request = TimeOffRequest(
        user_id=user_id,
        start_date=request.start_date,
        end_date=request.end_date,
        leave_type=request.leave_type,
        days_requested=request.days_requested,
        reason=request.reason,
        status="pending"
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

def get_requests_by_user(db: Session, user_id: UUID):
    return db.query(TimeOffRequest).filter(TimeOffRequest.user_id == user_id).all()

def get_request_by_id(db: Session, request_id: UUID):
    return db.query(TimeOffRequest).filter(TimeOffRequest.id == request_id).first()

def review_request(db: Session, request_id: UUID, reviewer_id: UUID, status: str, comment: str = None):
    request = get_request_by_id(db, request_id)
    if not request:
        return None
    request.status = status
    request.reviewed_by = reviewer_id
    request.review_comment = comment
    db.commit()
    db.refresh(request)
    return request
