from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate
from app.core.security import create_access_token
from app.schemas.auth import LoginRequest, Token
from app.crud import user as crud_user
from datetime import timedelta
from app.core.config import settings
from app.core.exceptions import bad_request, unauthorized
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = crud_user.get_user_by_email(db, user.email)
    if existing_user:
        raise bad_request("Email already registered")
    new_user = crud_user.create_user(db, user)
    return {"message": "User registered", "email": new_user.email}



@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud_user.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise unauthorized("Incorrect username or password")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role_id},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}