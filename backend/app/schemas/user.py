from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.schemas.enum import UserRole

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    fullname: str
    password: str
    role: UserRole
    confirm_password: str 

    @validator("confirm_password")
    def passwords_match(cls, v, values, **kwargs):
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v

class UserUpdate(BaseModel):
    username: Optional[str]
    email: Optional[EmailStr]
    full_name: Optional[str]
    password: Optional[str]
    is_active: Optional[bool]
    role: Optional[UserRole]

class UserOut(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    full_name: Optional[str]
    is_active: bool
    role_id: UUID
    role: UserRole
    create_date: datetime
    update_date: Optional[datetime]

    class Config:
        from_attributes = True
    