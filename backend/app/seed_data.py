import uuid
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database import SessionLocal
from app.models.role import Role
from app.models.user import User
from app.models.time_tracking import TimeTracking
from app.models.time_off_request import TimeOffRequest
from passlib.hash import bcrypt
from datetime import datetime, date
from app.schemas.enum import (
    UserRole,
    RecordTypeEnum,
    LeaveStatusEnum,
    LeaveTypeEnum
)


def seed_data():
    db: Session = SessionLocal()

    try:
       
        if db.execute(select(Role)).scalars().first():
            print("Seed ya ejecutado.")
            db.close()
            return

        print("Insertando datos iniciales...")

        rrhh_role = Role(id=uuid.uuid4(), name=UserRole.RRHH)
        employee_role = Role(id=uuid.uuid4(), name=UserRole.EMPLOYEE)
        db.add_all([rrhh_role, employee_role])
        db.commit()

        hashed_pw = bcrypt.hash("123456")

        rrhh_user = User(
            username="rrhh_admin",
            email="rrhh@empresa.com",
            full_name="Laura Recursos",
            hashed_password=hashed_pw,
            is_active=True,
            role_id=rrhh_role.id,
        )

        empleado1 = User(
            username="empleado1",
            email="empleado1@empresa.com",
            full_name="Carlos Pérez",
            hashed_password=hashed_pw,
            is_active=True,
            role_id=employee_role.id,
        )

        empleado2 = User(
            username="empleado2",
            email="empleado2@empresa.com",
            full_name="Ana García",
            hashed_password=hashed_pw,
            is_active=True,
            role_id=employee_role.id,
        )

        empleado3 = User(
            username="empleado3",
            email="empleado3@empresa.com",
            full_name="Miguel Torres",
            hashed_password=hashed_pw,
            is_active=True,
            role_id=employee_role.id,
        )

        db.add_all([rrhh_user, empleado1, empleado2, empleado3])
        db.commit()

        base_day = datetime(2025, 10, 10)
        db.add_all([
            TimeTracking(
                user_id=empleado1.id,
                record_type=RecordTypeEnum.CHECK_IN,
                timestamp=base_day.replace(hour=8, minute=0)
            ),
            TimeTracking(
                user_id=empleado1.id,
                record_type=RecordTypeEnum.CHECK_OUT,
                timestamp=base_day.replace(hour=16, minute=0)
            ),
            TimeTracking(
                user_id=empleado2.id,
                record_type=RecordTypeEnum.CHECK_IN,
                timestamp=base_day.replace(hour=9, minute=0)
            ),
            TimeTracking(
                user_id=empleado2.id,
                record_type=RecordTypeEnum.CHECK_OUT,
                timestamp=base_day.replace(hour=17, minute=0)
            ),
        ])

        db.add_all([
            TimeOffRequest(
                user_id=empleado1.id,
                start_date=date(2025, 10, 20),
                end_date=date(2025, 10, 22),
                leave_type=LeaveTypeEnum.VACATION,  
                days_requested=3,                  
                reason="Vacaciones",
                status=LeaveStatusEnum.APPROVED,
                reviewed_by=rrhh_user.id,
            ),
            TimeOffRequest(
                user_id=empleado2.id,
                start_date=date(2025, 11, 2),
                end_date=date(2025, 11, 3),
                leave_type=LeaveTypeEnum.SICK,      
                days_requested=2,                   
                reason="Cita médica",
                status=LeaveStatusEnum.PENDING,
                reviewed_by=rrhh_user.id,
            ),
        ])

        db.commit()
        print(" Seed ejecutado correctamente.")
    except Exception as e:
        print("Error al hacer seed:", e)
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
