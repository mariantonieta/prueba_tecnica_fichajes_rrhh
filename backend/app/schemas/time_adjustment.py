from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.schemas.enum import AdjustmentStatusEnum, AdjustmentTypeEnum

class TimeAdjustmentBase(BaseModel):
    adjusted_timestamp: datetime
    adjusted_type: AdjustmentTypeEnum
    reason: str

class TimeAjustmentCreate(TimeAdjustmentBase):
    time_record_id: UUID

class TimeAdjustmentOut(TimeAdjustmentBase):
    id: UUID
    user_id: UUID
    time_record_id: Optional[UUID] = None 
    status: AdjustmentStatusEnum
    reviewed_by: Optional[UUID] = None
    review_comment: Optional[str] = None
    
    class Config:
        from_attributes = True