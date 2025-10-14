from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from uuid import UUID
from datetime import datetime

from app.schemas.enum import UserRole

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str
    confirm_password: str 
    role: UserRole
    initial_vacation_days: Optional[float] 
    initial_weekly_hours: Optional[float] 
    initial_monthly_hours: Optional[float] 
    

    @validator("confirm_password")
    def passwords_match(cls, v, values, **kwargs):
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None
    initial_vacation_days: Optional[float] = None
    initial_weekly_hours: Optional[float] = None
    initial_monthly_hours: Optional[float] = None
                                                    
class UserOut(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    full_name: Optional[str]
    is_active: bool
    role_id: UUID
    role: str
    create_date: datetime
    update_date: Optional[datetime]
    initial_vacation_days: Optional[float]
    initial_weekly_hours: Optional[float]
    initial_monthly_hours: Optional[float]

    class Config:
        from_attributes = True

    
