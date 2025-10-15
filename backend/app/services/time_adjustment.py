from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional

from app.models.time_adjustment import TimeAdjustment
from app.models.time_tracking import TimeTracking
from app.schemas.time_adjustment import TimeAjustmentCreate, TimeAdjustmentOut
from app.schemas.enum import AdjustmentStatusEnum


def create_time_adjustment(db: Session, user_id: UUID, adjustment: TimeAjustmentCreate) -> TimeAdjustment:
    new_adjustment = TimeAdjustment(
        user_id=user_id,
        time_record_id=adjustment.time_record_id,
        adjusted_timestamp=adjustment.adjusted_timestamp,
        adjusted_type=adjustment.adjusted_type,
        reason=adjustment.reason,
        status=AdjustmentStatusEnum.PENDING
    )
    db.add(new_adjustment)
    db.commit()
    db.refresh(new_adjustment)
    return new_adjustment


def get_adjustments_by_user(db: Session, user_id: UUID) -> list[TimeAdjustment]:
    return db.query(TimeAdjustment).filter(TimeAdjustment.user_id == user_id).all()

def get_adjustment_by_id(db: Session, adjustment_id: UUID) -> Optional[TimeAdjustmentOut]:
    adjustment = db.query(TimeAdjustment).filter(TimeAdjustment.id == adjustment_id).first()
    if not adjustment:
        return None

    return TimeAdjustmentOut(
        id=adjustment.id,
        user_id=adjustment.user_id,
        full_name=adjustment.user.full_name if adjustment.user else None,
        time_record_id=adjustment.time_record_id,
        status=adjustment.status,
        reviewed_by=adjustment.reviewed_by,
        review_comment=adjustment.review_comment,
        adjusted_timestamp=adjustment.adjusted_timestamp,
        adjusted_type=adjustment.adjusted_type,
        reason=adjustment.reason,
    )
def review_adjustment(
    db: Session,
    adjustment_id: UUID,
    reviewer_id: UUID,
    status: AdjustmentStatusEnum,
    review_comment: Optional[str] = None
) -> Optional[TimeAdjustmentOut]:
   
    adjustment = db.query(TimeAdjustment).filter(TimeAdjustment.id == adjustment_id).first()
    if not adjustment:
        return None

    adjustment.status = status
    adjustment.reviewed_by = reviewer_id
    adjustment.review_comment = review_comment

    if status == AdjustmentStatusEnum.APPROVED and adjustment.time_record_id:
        _apply_time_record_adjustment(db, adjustment)

    db.commit()
    db.refresh(adjustment)

    return TimeAdjustmentOut.from_orm(adjustment)


def _apply_time_record_adjustment(db: Session, adjustment: TimeAdjustment):
    """Aplica los cambios del ajuste aprobado al registro de tiempo."""
    time_record = db.query(TimeTracking).filter(TimeTracking.id == adjustment.time_record_id).first()
    if not time_record:
        return

    time_record.timestamp = adjustment.adjusted_timestamp

    if adjustment.adjusted_type in ["ENTRY_CORRECTION", "MANUAL_ENTRY"]:
        time_record.record_type = "CHECK_IN"
    elif adjustment.adjusted_type == "EXIT_CORRECTION":
        time_record.record_type = "CHECK_OUT"
    
