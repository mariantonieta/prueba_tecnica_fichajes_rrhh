from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.core.deps import get_current_user
from app.schemas.time_off_request import TimeOffRequestCreate, TimeOffRequestOut, TimeOffRequestUpdate
from app.services import time_off_request as crud
from app.models import User
from app.core.exceptions import forbidden, not_found
from app.schemas.enum import UserRole

router = APIRouter(prefix="/time_off_requests", tags=["Time Off Requests"])


@router.post("/", response_model=TimeOffRequestOut)
def create_time_off(
    request: TimeOffRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = request.dict()
    data["user_id"] = current_user.id
    return crud.create_request(db, data)


@router.get("/{request_id}", response_model=TimeOffRequestOut)
def get_request(
    request_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    request_obj = crud.get_request(db, request_id)
    if not request_obj:
        raise not_found("Request not found")

    if current_user.role.name != UserRole.RRHH.value and request_obj.user_id != current_user.id:
        raise forbidden("You are not allowed to access this request")

    return crud.to_request_out(request_obj)


@router.patch("/{request_id}", response_model=TimeOffRequestOut)
def update_request(
    request_id: UUID,
    data: TimeOffRequestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.name != UserRole.RRHH.value:
        raise forbidden("Only HR can update requests")

    request_obj = crud.get_request(db, request_id)
    if not request_obj:
        raise not_found("Request not found")

    return crud.update_request(db, request_obj, data)


@router.get("/", response_model=list[TimeOffRequestOut])
def list_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.name == UserRole.RRHH.value:
        return crud.list_requests(db)
    return crud.list_requests_by_user(db, current_user.id)
