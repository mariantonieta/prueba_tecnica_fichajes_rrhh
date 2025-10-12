from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum
from uuid import UUID

class TimeTrackingBase(BaseModel):
    record_type: str 
    description: Optional[str] = None 
    
class TimeTrackingCreate(TimeTrackingBase):
    pass

class TimeTrackingOut(TimeTrackingBase):
    id: UUID
    user_id: UUID
    timestamp: datetime
    create_date: datetime
    update_date: Optional[datetime]

    class Config:
        from_attributes = True
        
class TimeTrackingSearchOut(BaseModel):
    id: UUID
    user_id: UUID
    record_type: str
    timestamp: datetime
    description: Optional[str]
    create_date: datetime
    update_date: Optional[datetime]
    user_full_name: Optional[str]  
    user_username: Optional[str]           
    user_email: Optional[str]    


    class Config:
        from_attributes = True