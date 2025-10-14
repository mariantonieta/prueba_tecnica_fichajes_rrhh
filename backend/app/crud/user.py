from sqlalchemy.orm import Session, joinedload
from datetime import datetime

from app.models.user import User
from app.models.role import Role
from app.schemas.user import UserCreate, UserOut, UserUpdate
from app.core.security import get_password_hash, verify_password
from app.core.exceptions import not_found, forbidden
from app.schemas.enum import UserRole
from app.schemas.user import UserCreate
from app.models.role import Role
from app.models.leave_balance import LeaveBalance
from app.core.security import get_password_hash
from app.schemas.enum import LeaveTypeEnum

def get_role_by_name(db: Session, name: str):
    return db.query(Role).filter(Role.name == name).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: str) -> User:
    return (
        db.query(User)
        .options(joinedload(User.role), joinedload(User.leave_balances))
        .filter(User.id == user_id)
        .first()
    )
def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    role_name = user.role.value if user.role else UserRole.EMPLOYEE.value
    
    role = get_role_by_name(db, role_name)
    if not role:
        raise ValueError(f"Role '{user.role.value}' does not exist in DB.")

    db_user = User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
        is_active=True,
        role_id=role.id,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    balance = LeaveBalance(
        user_id=db_user.id,
        year=datetime.now().year,
        leave_type=LeaveTypeEnum.VACATION,
        used_days=0,
        remaining_days=0,  
        weekly_hours=getattr(user, "initial_weekly_hours", 40),  
        monthly_hours=0,  
        last_updated=datetime.utcnow()
    )
    db.add(balance)
    db.commit()

    return db_user



def to_user_out(user: User) -> UserOut:
    current_year = datetime.now().year
    balance = None
    if hasattr(user, "leave_balances") and user.leave_balances:
        balance = next((b for b in user.leave_balances if b.year == current_year), None)

    return UserOut(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        role_id=user.role_id,
        role=user.role.name if user.role else "Unknown",
        create_date=user.create_date,
        update_date=user.update_date,
        initial_vacation_days=balance.remaining_days if balance else 0,
        initial_weekly_hours=balance.weekly_hours if balance else 40,
        initial_monthly_hours=balance.monthly_hours if balance else 0,
    )



def get_user_out_by_id(db: Session, user_id: str) -> UserOut:
    user = get_user_by_id(db, user_id)
    if not user:
        raise not_found("User not found")
    return to_user_out(user)

def get_all_users_out(db: Session):
    users = db.query(User).all()
    return [to_user_out(u) for u in users]


def update_user(db: Session, user: User, new_data: UserUpdate, current_user: User):
    if current_user.role.name != UserRole.RRHH.value:
        allowed_fields = ["username", "email", "full_name"]
    else:
        allowed_fields = new_data.dict(exclude_unset=True).keys()

    for key, value in new_data.dict(exclude_unset=True).items():
        if key not in allowed_fields:
            continue

        if key == "password":
            user.hashed_password = get_password_hash(value)
        elif key == "role" and current_user.role.name == UserRole.RRHH.value:
            role_obj = get_role_by_name(db, value.value)
            if role_obj:
                user.role_id = role_obj.id
        elif hasattr(user, key):
            setattr(user, key, value)

    balance = (
        db.query(LeaveBalance)
        .filter(LeaveBalance.user_id == user.id, LeaveBalance.year == datetime.now().year)
        .first()
    )
    if balance:
        if new_data.initial_weekly_hours is not None:
            balance.weekly_hours = new_data.initial_weekly_hours
        if new_data.initial_monthly_hours is not None:
            balance.monthly_hours = new_data.initial_monthly_hours
        if new_data.initial_vacation_days is not None:
            balance.remaining_days = new_data.initial_vacation_days
        balance.last_updated = datetime.utcnow()

    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: str, current_user: User):
    user = get_user_by_id(db, user_id)
    if not user:
        raise not_found("User not found")
    if current_user.role.name != UserRole.RRHH.value and current_user.id != user.id:
        raise forbidden("Not authorized")

    user.is_active = False
    db.commit()
    return {"message": "User deactivated"}


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
