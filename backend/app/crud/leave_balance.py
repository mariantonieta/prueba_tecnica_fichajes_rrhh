from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from uuid import UUID
from decimal import Decimal

from app.models.leave_balance import LeaveBalance
from app.core.exceptions import bad_request

FULL_TIME_WEEKLY_HOURS = 40.0
VACATION_DAYS_PER_FULLTIME_MONTH = 2.5


def _effective_weekly_hours(weekly_hours: Optional[float]) -> float:
    if not weekly_hours or weekly_hours <= 0:
        return FULL_TIME_WEEKLY_HOURS
    return float(weekly_hours)


def _accrual_days_for_month(weekly_hours: Optional[float]) -> float:
    hours = _effective_weekly_hours(weekly_hours)
    ratio = hours / FULL_TIME_WEEKLY_HOURS
    return VACATION_DAYS_PER_FULLTIME_MONTH * ratio


def get_balance(db: Session, balance_id: UUID) -> Optional[LeaveBalance]:
    return db.query(LeaveBalance).filter(LeaveBalance.id == balance_id).first()


def get_user_balance(db: Session, user_id: UUID, leave_type: str, year: int) -> Optional[LeaveBalance]:
    return (
        db.query(LeaveBalance)
        .filter(
            LeaveBalance.user_id == user_id,
            LeaveBalance.leave_type == leave_type,
            LeaveBalance.year == year,
        )
        .first()
    )


def list_balances(db: Session):
    balances = db.query(LeaveBalance).all()
    for b in balances:
        b.user_name = b.user.full_name
    return balances

def create_balance(db: Session, balance_data) -> LeaveBalance:
    new_balance = LeaveBalance(**balance_data.dict())
    db.add(new_balance)
    db.commit()
    db.refresh(new_balance)
    return new_balance


def update_balance(db: Session, balance_obj: LeaveBalance, data) -> LeaveBalance:
    for key, value in data.dict(exclude_unset=True).items():
        setattr(balance_obj, key, value)
    db.commit()
    db.refresh(balance_obj)
    return balance_obj



def get_or_create_user_year_balance(
    db: Session,
    user_id: UUID,
    leave_type: str,
    year: int,
    default_weekly_hours: Optional[float] = None
) -> LeaveBalance:
    balance = db.query(LeaveBalance).filter(
        LeaveBalance.user_id == user_id,
        LeaveBalance.leave_type == leave_type,
        LeaveBalance.year == year,
    ).first()
    
    if balance:
        return balance

    weekly_hours = _effective_weekly_hours(default_weekly_hours)
    balance_days = _accrual_days_for_month(weekly_hours)  # 2.5 si 40h

    new_balance = LeaveBalance(
        user_id=user_id,
        year=year,
        leave_type=leave_type,
        used_days=0.0,
        remaining_days=balance_days,
        weekly_hours=weekly_hours,
        monthly_hours=weekly_hours * 4.33,
        last_updated=datetime.utcnow(),
    )
    db.add(new_balance)
    db.commit()
    db.refresh(new_balance)
    return new_balance


def accrue_monthly_for_user(
    db: Session,
    user_id: UUID,
    year: int,
    month: int,
    leave_type: str = "VACATION",
    weekly_hours: Optional[float] = None
) -> LeaveBalance:
    balance = get_or_create_user_year_balance(db, user_id, leave_type, year, weekly_hours)

    if weekly_hours:
        balance.weekly_hours = _effective_weekly_hours(weekly_hours)
        balance.monthly_hours = balance.weekly_hours * 4.33

    days = Decimal(str(_accrual_days_for_month(balance.weekly_hours)))
    balance.remaining_days += days
    balance.last_updated = datetime.utcnow()

    db.commit()
    db.refresh(balance)
    return balance
def deduct_days(db: Session, user_id: UUID, leave_type: str, days_taken: float):
    year = datetime.utcnow().year

    balance = get_or_create_user_year_balance(db, user_id, leave_type, year)
    if not balance:
        raise bad_request("No se encontró un balance activo para este usuario")

    days_taken = Decimal(str(days_taken)) 

    if balance.remaining_days < days_taken:
        raise bad_request("No hay suficientes días disponibles")

    balance.used_days += days_taken
    balance.remaining_days -= days_taken
    balance.last_updated = datetime.utcnow()

    db.commit()
    db.refresh(balance)
    return balance
