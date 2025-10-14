from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import date
from app.schemas.enum import LeaveTypeEnum, LeaveStatusEnum

class TimeOffRequestBase(BaseModel):
    start_date: date
    end_date: date
    leave_type: LeaveTypeEnum
    reason: str
class TimeOffRequestCreate(TimeOffRequestBase):
    pass

class TimeOffRequestOut(TimeOffRequestBase):
    id: UUID
    user_id: UUID
    status: str
    days_requested: float   
    reviewed_by: Optional[UUID] = None
    review_comment: Optional[str] = None
    user_full_name: Optional[str] = None 
    
    class Config:
        from_attributes = True
        
class TimeOffRequestUpdate(BaseModel):
    status: Optional[LeaveStatusEnum]
    review_comment: Optional[str]