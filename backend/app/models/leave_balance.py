from sqlalchemy import Column, String, Numeric, Integer, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from app.models.entity_abstract import EntityAbstract
from sqlalchemy.types import Enum as PgEnum
from app.schemas.enum import LeaveTypeEnum

class LeaveBalances(EntityAbstract):
    __tablename__ = "leave_balances"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    leave_type = Column(PgEnum(LeaveTypeEnum, name="leave_balance_type_enum"), nullable=False)
    remaining_days = Column(Numeric(7, 2), default=0, nullable=False)
    year = Column(Integer, nullable=False)

    __table_args__ = (
        Index("uq_leave_user__year", "user_id", "leave_type", "year", unique=True),
    )
