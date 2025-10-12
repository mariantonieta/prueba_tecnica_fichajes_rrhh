from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import date

class TimeOffRequestBase(BaseModel):
    start_date: date
    end_date: date
    leave_type: str 
    days_requested: float
    reason: str

class TimeOffRequestCreate(TimeOffRequestBase):
    pass

class TimeOffRequestOut(TimeOffRequestBase):
    id: UUID
    user_id: UUID
    status: str
    reviewed_by: Optional[UUID] = None
    review_comment: Optional[str] = None
    
    class Config:
        from_attributes = True