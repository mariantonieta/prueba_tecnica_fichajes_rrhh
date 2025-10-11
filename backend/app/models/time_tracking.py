from sqlalchemy import Column, String, Text, DateTime, CheckConstraint, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.entity_abstract import EntityAbstract
from app.schemas.enum import RecordTypeEnum
from sqlalchemy.types import Enum as PgEnum

class TimeTracking(EntityAbstract):
    __tablename__ = "time_tracking"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    record_type = Column(PgEnum(RecordTypeEnum, name="record_type_enum"), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    description = Column(Text, nullable=True)
    
    user = relationship("User", back_populates="time_records")
    
    
    