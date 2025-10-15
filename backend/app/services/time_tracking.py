from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timedelta, timezone
import calendar


from app.models import TimeTracking, User, TimeAdjustment
from app.schemas.time_tracking import TimeTrackingCreate
from app.core.exceptions import bad_request, conflict


MIN_TIME_BETWEEN_RECORDS = 600  


def create_time_record(db: Session, user_id: UUID, record: TimeTrackingCreate):
    now = datetime.now(timezone.utc)

    last_record = (
        db.query(TimeTracking)
        .filter(TimeTracking.user_id == user_id)
        .order_by(TimeTracking.timestamp.desc())
        .first()
    )

    if last_record:
        delta = (now - last_record.timestamp).total_seconds()
        if delta < MIN_TIME_BETWEEN_RECORDS:
            raise conflict(f"Debes esperar {MIN_TIME_BETWEEN_RECORDS} segundos antes de fichar de nuevo.")
        if last_record.record_type.lower() == record.record_type.lower():
            raise bad_request(f"No puedes hacer {record.record_type} dos veces seguidas.")

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
    return (
        db.query(TimeTracking)
        .filter(TimeTracking.user_id == user_id)
        .order_by(TimeTracking.timestamp.desc())
        .all()
    )

def _query_time_records_with_user_info(db: Session):
    return (
        db.query(TimeTracking, User.username, User.full_name, User.email)
        .join(User, TimeTracking.user_id == User.id)
    )


def _serialize_records(records):
    return [
        {
            "id": r.id,
            "user_id": r.user_id,
            "record_type": r.record_type,
            "timestamp": r.timestamp,
            "description": r.description,
            "create_date": r.create_date,
            "update_date": r.update_date,
            "user_full_name": full_name,
            "user_username": username,
            "user_email": email,
        }
        for r, username, full_name, email in records
    ]


def _paginate(query, limit, offset):
    total = query.count()
    records = query.order_by(TimeTracking.timestamp.desc()).offset(offset).limit(limit).all()
    return total, records


def get_time_records_by_user_with_user_info(db: Session, user_id: UUID, limit: int = 10, offset: int = 0):
    query = _query_time_records_with_user_info(db).filter(TimeTracking.user_id == user_id)
    total, records = _paginate(query, limit, offset)
    result = _serialize_records(records)
    return {"total": total, "count": len(result), "limit": limit, "offset": offset, "results": result}


def search_time_records_with_user_info(
    db: Session,
    user_id: UUID = None,
    user_full_name: str = None,
    limit: int = 10,
    offset: int = 0,
):
    query = _query_time_records_with_user_info(db)

    if user_id:
        query = query.filter(TimeTracking.user_id == user_id)
    if user_full_name:
        query = query.filter(User.full_name.ilike(f"%{user_full_name}%"))

    total, records = _paginate(query, limit, offset)
    result = _serialize_records(records)
    return {"total": total, "count": len(result), "limit": limit, "offset": offset, "results": result}


def get_all_time_records_with_user_info(db: Session):
    records = _query_time_records_with_user_info(db).order_by(TimeTracking.timestamp.desc()).all()
    return _serialize_records(records)



def calculate_hours_worked(records: list[TimeTracking], adjustments: list[TimeAdjustment] = []):
    total_seconds = 0
    check_in_time = None

    all_records = records[:]
    for adj in adjustments:
        if adj.status == "APPROVED":
            if adj.adjusted_type in ["ENTRY_CORRECTION", "MANUAL_ENTRY"]:
                rtype = "check_in"
            elif adj.adjusted_type in ["EXIT_CORRECTION"]:
                rtype = "check_out"
            else:
                continue

            all_records.append(TimeTracking(
                user_id=adj.user_id,
                record_type=rtype,
                timestamp=adj.adjusted_timestamp,
                description=adj.reason,
                id=adj.id,
                create_date=adj.create_date,
                update_date=adj.update_date,
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
        .filter(TimeTracking.user_id == user_id,
                TimeTracking.timestamp >= week_start,
                TimeTracking.timestamp < week_end)
        .all()
    )

    hours = calculate_hours_worked(records)
    return {"hours_worked": hours, "weekly_limit": 40, "over_limit": max(0, hours - 40)}


def get_monthly_hours(db: Session, user_id: UUID, year: int, month: int):
    start_date = datetime(year, month, 1)
    last_day = calendar.monthrange(year, month)[1]
    end_date = datetime(year, month, last_day, 23, 59, 59)

    records = (
        db.query(TimeTracking)
        .filter(TimeTracking.user_id == user_id,
                TimeTracking.timestamp >= start_date,
                TimeTracking.timestamp <= end_date)
        .all()
    )

    hours = calculate_hours_worked(records)
    monthly_limit = 40 * 4
    return {"hours_worked": hours, "monthly_limit": monthly_limit, "over_limit": max(0, hours - monthly_limit)}
