from app.schemas.enum import LeaveStatusEnum, LeaveTypeEnum
from sqlalchemy import Column, String, Text, Date, ForeignKey, Numeric, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.entity_abstract import EntityAbstract
from sqlalchemy.types import Enum as PgEnum

class TimeOffRequest(EntityAbstract):
    __tablename__ = "time_off_requests"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    leave_type = Column(PgEnum(LeaveTypeEnum, name="leave_type_enum"), nullable=False)
    days_requested = Column(Numeric(5, 2), CheckConstraint('days_requested > 0'), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(PgEnum(LeaveStatusEnum, name="leave_status_enum"), default=LeaveStatusEnum.PENDING)
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    review_comment = Column(Text)

    user = relationship(
        "User",
        back_populates="time_off_requests",
        foreign_keys=[user_id]
    )
    
    reviewer = relationship(
        "User",
        back_populates="reviews_done",
        foreign_keys=[reviewed_by]
    )

