from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timedelta, timezone

from app.models.time_tracking import TimeTracking
from app.schemas.time_tracking import TimeTrackingCreate
from app.models.user import User
from app.core.exceptions import bad_request, conflict
import calendar
from app.models.time_adjustment import TimeAdjustment


MIN_TIME_BETWEEN_RECORDS = 600  


def create_time_record(db: Session, user_id: UUID, record: TimeTrackingCreate):
    last_record = (
        db.query(TimeTracking)
        .filter(TimeTracking.user_id == user_id)
        .order_by(TimeTracking.timestamp.desc())
        .first()
    )

    now = datetime.now(timezone.utc)

    if last_record and (now - last_record.timestamp) < timedelta(seconds=MIN_TIME_BETWEEN_RECORDS):
        raise conflict(f"Debes esperar al menos {MIN_TIME_BETWEEN_RECORDS} segundos antes de registrar otro fichaje.")

    if last_record:
        if last_record.record_type.lower() == "check_in" and record.record_type.lower() == "check_in":
            raise bad_request("No puedes hacer check-in dos veces seguidas.")
        if last_record.record_type.lower() == "check_out" and record.record_type.lower() == "check_out":
            raise bad_request("No puedes hacer check-out dos veces seguidas.")

    new_record = TimeTracking(
        user_id=user_id,
        record_type=record.record_type,
        description=record.description,
        timestamp=now,
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


def get_time_records_by_user(db: Session, user_id: UUID):
    return db.query(TimeTracking).filter(TimeTracking.user_id == user_id).all()

def get_time_records_by_user_with_user_info(db: Session, user_id: UUID):
    records = (
        db.query(TimeTracking, User.username, User.full_name, User.email)
        .join(User, TimeTracking.user_id == User.id)
        .filter(TimeTracking.user_id == user_id)
        .order_by(TimeTracking.timestamp.desc())
        .all()
    )
    
    result = []
    for record, username, full_name, email in records:
        result.append({
            "id": record.id,
            "user_id": record.user_id,
            "record_type": record.record_type,
            "timestamp": record.timestamp,
            "description": record.description,
            "create_date": record.create_date,
            "update_date": record.update_date,
            "user_full_name": full_name,  
            "user_username": username,  
             "user_email": email,   
        })
    
    return result

def search_time_records(db: Session, user_id: UUID = None, username: str = None):
 
    query = db.query(TimeTracking)

    if user_id:
        query = query.filter(TimeTracking.user_id == user_id)

    if username:
        query = (
            query.join(User)
            .filter(User.username.ilike(f"%{username}%"))
        )

    return query.order_by(TimeTracking.timestamp.desc()).all()

def search_time_records_with_user_info(db: Session, user_id: UUID = None, user_full_name: str = None):
    
    query = (
        db.query(TimeTracking, User.username, User.full_name, User.email)
        .join(User, TimeTracking.user_id == User.id)
    )

    if user_id:
        query = query.filter(TimeTracking.user_id == user_id)

    if user_full_name:
        query = query.filter(User.full_name.ilike(f"%{user_full_name}%"))

    records = query.order_by(TimeTracking.timestamp.desc()).all()
    
    
    result = []
    for record, username, full_name, email in records:
        result.append({
            "id": record.id,
            "user_id": record.user_id,
            "record_type": record.record_type,
            "timestamp": record.timestamp,
            "description": record.description,
            "create_date": record.create_date,
            "update_date": record.update_date,
            "user_full_name": full_name,
            "user_username": username,  
            "user_email": email  

        })
    
    return result

def get_all_time_records_with_user_info(db: Session):
    records = (
        db.query(TimeTracking, User.username, User.full_name, User.email)
        .join(User, TimeTracking.user_id == User.id)
        .order_by(TimeTracking.timestamp.desc())
        .all()
    )
    
    result = []
    for record, username, full_name, email in records:
        result.append({
            "id": record.id,
            "user_id": record.user_id,
            "record_type": record.record_type,
            "timestamp": record.timestamp,
            "description": record.description,
            "create_date": record.create_date,
            "update_date": record.update_date,
            "user_full_name": full_name,
            "user_username": username,  
            "user_email": email  
        })
    
    return result

def calculate_hours_worked(records: list[TimeTracking], adjustments: list[TimeAdjustment] = []):
    total_seconds = 0
    check_in_time = None
    all_records = records[:]
    for adj in adjustments:
        if adj.status == "APPROVED":
            record_type = None
            if adj.adjusted_type in ["ENTRY_CORRECTION", "MANUAL_ENTRY"]:
                record_type = "check_in"
            elif adj.adjusted_type in ["EXIT_CORRECTION"]:
                record_type = "check_out"
            if record_type and adj.adjusted_timestamp:
                all_records.append(TimeTracking(
                    user_id=adj.user_id,
                    record_type=record_type,
                    timestamp=adj.adjusted_timestamp,
                    description=adj.reason,
                    id=adj.id, 
                    create_date=adj.create_date,
                    update_date=adj.update_date
                ))

    for record in sorted(all_records, key=lambda r: r.timestamp):
        if record.record_type.lower() in ["check_in", "clock-in"]:
            check_in_time = record.timestamp
        elif record.record_type.lower() in ["check_out", "clock-out"] and check_in_time:
            total_seconds += (record.timestamp - check_in_time).total_seconds()
            check_in_time = None

    return total_seconds / 3600

def get_weekly_hours(db: Session, user_id: UUID, week_start: datetime):
    if week_start.tzinfo is None:
        week_start = week_start.replace(tzinfo=timezone.utc)
    week_end = week_start + timedelta(days=7)

    records = (
        db.query(TimeTracking)
        .filter(
            TimeTracking.user_id == user_id,
            TimeTracking.timestamp >= week_start,
            TimeTracking.timestamp < week_end,
        )
        .all()
    )

    hours_worked = calculate_hours_worked(records)
    return {
        "hours_worked": hours_worked,
        "weekly_limit": 40,
        "over_limit": max(0, hours_worked - 40),
    }



def get_monthly_hours(db: Session, user_id: UUID, year: int, month: int):
    start_date = datetime(year, month, 1)
    last_day = calendar.monthrange(year, month)[1]
    end_date = datetime(year, month, last_day, 23, 59, 59)

    records = (
        db.query(TimeTracking)
        .filter(
            TimeTracking.user_id == user_id,
            TimeTracking.timestamp >= start_date,
            TimeTracking.timestamp <= end_date,
        )
        .all()
    )

    hours_worked = calculate_hours_worked(records)
    monthly_limit = 40 * 4

    return {
        "hours_worked": hours_worked,
        "monthly_limit": monthly_limit,
        "over_limit": max(0, hours_worked - monthly_limit),
    }