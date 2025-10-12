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
##evito duplicar el seed si ya esta ejecutado
    try:
        if db.execute(select(Role)).scalars().first():
            print("Seed ya ejecutado")
            db.close()
            return

        print("Insertando datos iniciales...")
##asigno los roles
        rrhh_role = Role(id=uuid.uuid4(), name=UserRole.RRHH)
        employee_role = Role(id=uuid.uuid4(), name=UserRole.EMPLOYEE)
        db.add_all([rrhh_role, employee_role])
        db.commit()

##contraseña base para todos los usuarios
        hashed_pw = bcrypt.hash("123456")

## Usuarios
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

##asigno los fichajes
        base_day = datetime(2025, 10, 10)
        db.add_all([
            # Mariantonieta
            TimeTracking(
                user_id=mariantonieta.id,
                record_type=RecordTypeEnum.CHECK_IN,
                timestamp=base_day.replace(hour=8, minute=0)
            ),
            TimeTracking(
                user_id=mariantonieta.id,
                record_type=RecordTypeEnum.CHECK_OUT,
                timestamp=base_day.replace(hour=16, minute=15)
            ),

            # Luisa
            TimeTracking(
                user_id=luisa.id,
                record_type=RecordTypeEnum.CHECK_IN,
                timestamp=base_day.replace(hour=9, minute=5)
            ),
            TimeTracking(
                user_id=luisa.id,
                record_type=RecordTypeEnum.CHECK_OUT,
                timestamp=base_day.replace(hour=17, minute=0)
            ),

            # Juan
            TimeTracking(
                user_id=juan.id,
                record_type=RecordTypeEnum.CHECK_IN,
                timestamp=base_day.replace(hour=7, minute=50)
            ),
            TimeTracking(
                user_id=juan.id,
                record_type=RecordTypeEnum.CHECK_OUT,
                timestamp=base_day.replace(hour=15, minute=45)
            ),
        ])

##Solicitudes de ausencia 
        db.add_all([
            TimeOffRequest(
                user_id=mariantonieta.id,
                start_date=date(2025, 10, 20),
                end_date=date(2025, 10, 22),
                leave_type=LeaveTypeEnum.VACATION,
                days_requested=3,
                reason="Vacaciones familiares",
                status=LeaveStatusEnum.APPROVED,
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
                status=LeaveStatusEnum.APPROVED,
                reviewed_by=rrhh_user.id,
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
