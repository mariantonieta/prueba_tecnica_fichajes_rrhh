from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        full_name=user.fullname,
        hashed_password=hashed_password,
        is_active=True,
        role_id=None  
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_id(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username_or_email(db: Session, login: str):
    return db.query(User).filter(
        (User.email == login) | (User.username == login)
    ).first()

def authenticate_user(db: Session, login: str, password: str):
    user = get_user_by_username_or_email(db, login)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user