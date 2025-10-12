from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Text, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.entity_abstract import EntityAbstract
from app.schemas.enum import AdjustmentStatusEnum, AdjustmentTypeEnum
from sqlalchemy.types import Enum as PgEnum

class TimeAdjustment(EntityAbstract):
    __tablename__ = "time_adjustments"
    
    time_record_id = Column(UUID(as_uuid=True), ForeignKey("time_tracking.id", ondelete="SET NULL"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    adjusted_timestamp = Column(DateTime(timezone=True))
    adjusted_type = Column(PgEnum(AdjustmentTypeEnum, name="adjusted_type_enum"), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(PgEnum(AdjustmentStatusEnum, name="adjustment_status_enum"), default=AdjustmentStatusEnum.PENDING)
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    review_comment = Column(Text)
    
    user = relationship(
        "User",
        back_populates="time_adjustments",
        foreign_keys=[user_id]
    )

    reviewer = relationship(
        "User",
        foreign_keys=[reviewed_by]
    )

