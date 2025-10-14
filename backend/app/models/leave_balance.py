from sqlalchemy import Column, Integer, ForeignKey, DateTime, Float, Numeric, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.types import Enum as PgEnum
from datetime import datetime

from app.models.entity_abstract import EntityAbstract
from app.schemas.enum import LeaveTypeEnum


class LeaveBalance(EntityAbstract):
    __tablename__ = "leave_balances"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    year = Column(Integer, nullable=False)
    leave_type = Column(PgEnum(LeaveTypeEnum, name="leave_balance_type_enum"), nullable=False)

    remaining_days = Column(Numeric(7, 2), nullable=False)
    used_days = Column(Numeric(7, 2), nullable=False)
    weekly_hours = Column(Float, nullable=False)
    monthly_hours = Column(Float, nullable=False)
    last_updated = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User", back_populates="leave_balances")

    __table_args__ = (
        Index("uq_leave_user_year_type", "user_id", "leave_type", "year", unique=True),
    )
