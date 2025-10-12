from sqlalchemy.orm import Session, joinedload
from app.models.user import User
from app.models.role import Role
from app.schemas.user import UserCreate, UserOut, UserUpdate
from app.core.security import get_password_hash, verify_password
from app.core.exceptions import not_found, forbidden
from app.schemas.enum import UserRole

def to_user_out(user: User) -> UserOut:
    return UserOut(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        role_id=user.role_id,
        role=user.role.name if user.role else "Unknown",
        create_date=user.create_date,
        update_date=user.update_date
    )

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_role_by_name(db: Session, name: str):
    return db.query(Role).filter(Role.name == name).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    role = get_role_by_name(db, user.role.value)
    if not role:
        raise ValueError(f"Role '{user.role.value}' does not exist in DB.")
    
    db_user = User(
        username=user.username,
        email=user.email,
        full_name=user.fullname,
        hashed_password=hashed_password,
        is_active=True,
        role_id=role.id,  
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_id(db: Session, user_id: str) -> User:
    return db.query(User).filter(User.id == user_id).first()

def get_user_out_by_id(db: Session, user_id: str) -> UserOut:
    user = get_user_by_id(db, user_id)
    if not user:
        raise not_found("User not found")
    return to_user_out(user)

def get_all_users_out(db: Session):
    users = db.query(User).all()
    return [to_user_out(u) for u in users]

def update_user(db: Session, user_id: str, new_data: UserUpdate, current_user: User):
    user = get_user_by_id(db, user_id)
    if not user:
        raise not_found("User not found")
    
    if current_user.role.name != UserRole.RRHH.value and current_user.id != user.id:
        raise forbidden("Not authorized")
    
    for key, value in new_data.dict(exclude_unset=True).items():
        if key == "password":
            user.hashed_password = get_password_hash(value)
        elif key == "role":
            role_obj = get_role_by_name(db, value.value)
            if role_obj:
                user.role_id = role_obj.id
        elif hasattr(user, key):
            setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: str, current_user: User):
    user = get_user_by_id(db, user_id)
    if not user:
        raise not_found("User not found")
    
    if current_user.role.name != UserRole.RRHH.value and current_user.id != user.id:
        raise forbidden("Not authorized")
    
    db.delete(user)
    db.commit()
    return True

def authenticate_user(db: Session, login: str, password: str):
    user = (
        db.query(User)
        .options(joinedload(User.role))
        .filter((User.email == login) | (User.username == login))
        .first()
    )
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user
