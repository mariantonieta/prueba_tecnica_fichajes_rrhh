from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.deps import get_current_user, require_rrhh
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate, UserCreate
from app.crud import user as crud_user
from app.core.exceptions import not_found, bad_request
from app.schemas.enum import UserRole

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/create")
def create_user_endpoint(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_rrhh)
):
    existing_user = crud_user.get_user_by_email(db, user.email)
    if existing_user:
        raise bad_request("Email already exists")

    new_user = crud_user.create_user(db, user)
    return {"message": "User created successfully", "email": new_user.email}

@router.get("/", response_model=list[UserOut])
def get_all_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud_user.get_all_users_out(db)

@router.get("/me", response_model=UserOut)
def get_current_user_endpoint(current_user: User = Depends(get_current_user)):
    return crud_user.to_user_out(current_user)

@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_out = crud_user.get_user_out_by_id(db, user_id)
    return user_out

@router.patch("/{user_id}", response_model=UserOut)
def update_user_endpoint(
    user_id: str,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    user_to_update = crud_user.get_user_by_id(db, user_id)
    if not user_to_update:
        raise not_found("User not found")
    if current_user.role.name != UserRole.RRHH.value:
        allowed_fields = {"username", "email", "full_name"}
        update_data = {k: v for k, v in user_update.dict(exclude_unset=True).items() if k in allowed_fields}
    else:
        update_data = user_update.dict(exclude_unset=True)
    updated_user = crud_user.update_user(db, user_to_update, UserUpdate(**update_data), current_user)

    return crud_user.to_user_out(updated_user)

@router.delete("/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    crud_user.delete_user(db, user_id, current_user)
    return {"message": "User deleted"}

