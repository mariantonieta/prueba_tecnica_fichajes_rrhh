from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.services import leave_balance as crud
from app.schemas.leave_balance import LeaveBalanceRead, LeaveBalanceCreate, LeaveBalanceUpdate
from app.core.deps import get_current_user
from app.schemas.enum import UserRole

router = APIRouter(prefix="/leave_balances", tags=["Leave Balances"])

@router.get("/me", response_model=LeaveBalanceRead)
def get_my_balance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    now = datetime.utcnow()
    balance = crud.get_or_create_user_year_balance(
        db, current_user.id, leave_type="VACATION", year=now.year
    )
    if not balance:
        raise HTTPException(status_code=404, detail="No leave balance found for user")
    return balance


@router.get("/", response_model=list[LeaveBalanceRead])
def list_all_leave_balances(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.name != UserRole.RRHH.value:
        raise HTTPException(status_code=403, detail="Only HR can list all balances")
    return crud.list_balances(db)


@router.post("/", response_model=LeaveBalanceRead)
def create_leave_balance(
    balance: LeaveBalanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.name != UserRole.RRHH.value:
        raise HTTPException(status_code=403, detail="Only HR can create leave balances")
    return crud.create_balance(db, balance)


@router.get("/{balance_id}", response_model=LeaveBalanceRead)
def get_leave_balance(balance_id: UUID, db: Session = Depends(get_db)):
    balance_obj = crud.get_balance(db, balance_id)
    if not balance_obj:
        raise HTTPException(status_code=404, detail="Leave balance not found")
    return balance_obj


@router.patch("/{balance_id}", response_model=LeaveBalanceRead)
def update_leave_balance(
    balance_id: UUID,
    data: LeaveBalanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.name != UserRole.RRHH.value:
        raise HTTPException(status_code=403, detail="Only HR can update leave balances")

    balance_obj = crud.get_balance(db, balance_id)
    if not balance_obj:
        raise HTTPException(status_code=404, detail="Leave balance not found")

    return crud.update_balance(db, balance_obj, data)


@router.post("/{user_id}/accrue", response_model=LeaveBalanceRead)
def accrue_monthly_for_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.name != UserRole.RRHH.value:
        raise HTTPException(status_code=403, detail="Only HR can accrue leave")

    now = datetime.utcnow()
    balance = crud.accrue_monthly_for_user(
        db, user_id, year=now.year, month=now.month
    )
    if not balance:
        raise HTTPException(status_code=404, detail="Leave balance not found for user")
    return balance
