from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import date, datetime, timezone

from app.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.time_tracking import TimeTrackingCreate, TimeTrackingOut, TimeTrackingSearchOut, PaginatedTimeTrackingSearchOut
from app.services import time_tracking
from app.schemas.enum import UserRole
from app.core.exceptions import forbidden, bad_request, DomainError

router = APIRouter(prefix="/time-tracking", tags=["Time Tracking"])

@router.post("/", response_model=TimeTrackingOut)
def create_time_record(
    record: TimeTrackingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_record = time_tracking.create_time_record(db, user_id=current_user.id, record=record)
    return new_record

@router.get("/", response_model=PaginatedTimeTrackingSearchOut)
def get_time_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = Query(10, ge=1, le=100),  
    offset: int = Query(0, ge=0)
):
    return time_tracking.get_time_records_by_user_with_user_info(
        db=db,
        user_id=current_user.id,
        limit=limit,
        offset=offset
    )

@router.get("/user/{user_id}",response_model=PaginatedTimeTrackingSearchOut)
def get_time_records_by_user(
    user_id: UUID,
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role.name != UserRole.RRHH:
        raise forbidden("Solo RRHH puede acceder a esta informacion")

    return time_tracking.get_time_records_by_user_with_user_info(db, user_id=user_id)

@router.get("/search", response_model=List[TimeTrackingSearchOut])
def search_time_records(
    user_id: Optional[UUID] = Query(None),
    user_full_name: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role.name != UserRole.RRHH:
        raise forbidden("Not authorized")

    return time_tracking.search_time_records_with_user_info(
        db=db,
        user_id=user_id,
        user_full_name=user_full_name,
        limit=limit,
        offset=offset,
    )

@router.get("/weekly")
def weekly_hours(
    week_start: date = Query(..., description="Inicio de la semana, ej: 2025-10-06"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    week_start_dt = datetime.combine(week_start, datetime.min.time(), tzinfo=timezone.utc)
    return time_tracking.get_weekly_hours(db, current_user.id, week_start_dt)

@router.get("/monthly")
def monthly_hours(
    year: int = Query(..., description="Año, ej: 2025"),
    month: int = Query(..., description="Mes numérico, ej: 10"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return time_tracking.get_monthly_hours(db, current_user.id, year, month)
    except DomainError as e:
        raise bad_request(e.message)
