from pydantic import BaseModel
from uuid import UUID
from app.schemas.enum import LeaveTypeEnum
from typing import Optional

class LeaveBalanceBase(BaseModel):
    leave_type: LeaveTypeEnum
    remaining_days: float
    year: int
    total_days: Optional[float] = None 

class LeaveBalanceCreate(LeaveBalanceBase):
    user_id: UUID

class LeaveBalanceRead(LeaveBalanceBase):
    id: UUID
    user_id: UUID
    user_name: Optional[str] = None 
    total_days: Optional[float] = None 

class LeaveBalanceUpdate(BaseModel):
    remaining_days: Optional[float]
