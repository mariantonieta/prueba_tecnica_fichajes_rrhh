import uuid
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database import SessionLocal
from app.models.role import Role
from app.models.user import User
from app.models.time_tracking import TimeTracking
from app.models.time_off_request import TimeOffRequest
from app.models.leave_balance import LeaveBalance
from app.models.time_adjustment import TimeAdjustment
from passlib.hash import bcrypt
from datetime import datetime, date
from decimal import Decimal
from app.schemas.enum import (
    UserRole,
    RecordTypeEnum,
    LeaveStatusEnum,
    LeaveTypeEnum,
    AdjustmentStatusEnum,
    AdjustmentTypeEnum
)

FULL_TIME_WEEKLY_HOURS = 40.0
VACATION_DAYS_PER_FULLTIME_MONTH = 2.5

def _effective_weekly_hours(weekly_hours: float) -> float:
    if not weekly_hours or weekly_hours <= 0:
        return FULL_TIME_WEEKLY_HOURS
    return float(weekly_hours)

def _initial_vacation_days(weekly_hours: float) -> float:
    hours = _effective_weekly_hours(weekly_hours)
    ratio = hours / FULL_TIME_WEEKLY_HOURS
    return VACATION_DAYS_PER_FULLTIME_MONTH * ratio  

def seed_data():
    db: Session = SessionLocal()
    try:
        if db.execute(select(Role)).scalars().first():
            print("Seed ya ejecutado")
            db.close()
            return

        print("Insertando datos iniciales...")

        rrhh_role = Role(id=uuid.uuid4(), name=UserRole.RRHH)
        employee_role = Role(id=uuid.uuid4(), name=UserRole.EMPLOYEE)
        db.add_all([rrhh_role, employee_role])
        db.commit()

        hashed_pw = bcrypt.hash("123456")

        rrhh_user = User(
            username="nerea_rrhh",
            email="nerea@empresa.com",
            full_name="Nerea Lopez",
            hashed_password=hashed_pw,
            is_active=True,
            role_id=rrhh_role.id,
        )

        mariantonieta = User(
            username="mariantonieta",
            email="mariantonieta@empresa.com",
            full_name="Mariantonieta Chacon",
            hashed_password=hashed_pw,
            is_active=True,
            role_id=employee_role.id,
        )

        luisa = User(
            username="luisa",
            email="luisa@empresa.com",
            full_name="Luisa Fernández",
            hashed_password=hashed_pw,
            is_active=True,
            role_id=employee_role.id,
        )

        juan = User(
            username="juan",
            email="juan@empresa.com",
            full_name="Juan Morales",
            hashed_password=hashed_pw,
            is_active=True,
            role_id=employee_role.id,
        )

        db.add_all([rrhh_user, mariantonieta, luisa, juan])
        db.commit()

        user_balances = [
            (mariantonieta.id, 40), 
            (luisa.id, 40),          
            (juan.id, 40),
        ]

        balances = []
        for user_id, weekly_hours in user_balances:
            init_days = Decimal(str(_initial_vacation_days(weekly_hours)))
            balance = LeaveBalance(
                user_id=user_id,
                year=datetime.now().year,
                leave_type=LeaveTypeEnum.VACATION,
                used_days=0,
                remaining_days=init_days,
                weekly_hours=weekly_hours,
                monthly_hours=weekly_hours * 4.33,
                total_days=init_days,  
                last_updated=datetime.utcnow()
            )
            balances.append(balance)

        db.add_all(balances)
        db.commit()

        base_day = datetime(2025, 10, 10)
        db.add_all([
            TimeTracking(user_id=mariantonieta.id, record_type=RecordTypeEnum.CHECK_IN, timestamp=base_day.replace(hour=8, minute=0)),
            TimeTracking(user_id=mariantonieta.id, record_type=RecordTypeEnum.CHECK_OUT, timestamp=base_day.replace(hour=16, minute=15)),

            TimeTracking(user_id=luisa.id, record_type=RecordTypeEnum.CHECK_IN, timestamp=base_day.replace(hour=9, minute=5)),
            TimeTracking(user_id=luisa.id, record_type=RecordTypeEnum.CHECK_OUT, timestamp=base_day.replace(hour=17, minute=0)),

            TimeTracking(user_id=juan.id, record_type=RecordTypeEnum.CHECK_IN, timestamp=base_day.replace(hour=7, minute=50)),
            TimeTracking(user_id=juan.id, record_type=RecordTypeEnum.CHECK_OUT, timestamp=base_day.replace(hour=15, minute=45)),
        ])
        db.commit()

        db.add_all([
            TimeOffRequest(
                user_id=mariantonieta.id,
                start_date=date(2025, 10, 20),
                end_date=date(2025, 10, 22),
                leave_type=LeaveTypeEnum.VACATION,
                days_requested=3,
                reason="Vacaciones familiares",
                status=LeaveStatusEnum.PENDING,
                reviewed_by=rrhh_user.id,
            ),
            TimeOffRequest(
                user_id=luisa.id,
                start_date=date(2025, 11, 2),
                end_date=date(2025, 11, 3),
                leave_type=LeaveTypeEnum.SICK,
                days_requested=2,
                reason="Gripe leve",
                status=LeaveStatusEnum.PENDING,
                reviewed_by=rrhh_user.id,
            ),
            TimeOffRequest(
                user_id=juan.id,
                start_date=date(2025, 11, 10),
                end_date=date(2025, 11, 10),
                leave_type=LeaveTypeEnum.PERSONAL,
                days_requested=1,
                reason="Trámite personal",
                status=LeaveStatusEnum.PENDING,
                reviewed_by=rrhh_user.id,
            ),
        ])
        db.commit()

        db.add_all([
            TimeAdjustment(
                user_id=mariantonieta.id,
                adjusted_timestamp=base_day.replace(hour=8, minute=5),
                adjusted_type=AdjustmentTypeEnum.MANUAL_ENTRY,
                reason="Entrada corregida",
                status=AdjustmentStatusEnum.PENDING,
                reviewed_by=rrhh_user.id
            ),
            TimeAdjustment(
                user_id=luisa.id,
                adjusted_timestamp=base_day.replace(hour=17, minute=5),
                adjusted_type=AdjustmentTypeEnum.EXIT_CORRECTION,
                reason="Salida corregida",
                status=AdjustmentStatusEnum.PENDING,
                reviewed_by=None
            ),
        ])
        db.commit()

        print("Seed ejecutado correctamente.")
    except Exception as e:
        print("Error al hacer seed:", e)
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
