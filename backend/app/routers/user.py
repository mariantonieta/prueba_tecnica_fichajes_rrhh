from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.deps import get_current_user, require_role
from app.models.user import User
from app.schemas.enum import UserRole
from app.core.exceptions import forbidden, not_found

router = APIRouter(prefix="/users", tags=["users"])
@router.get("/{user_id}")
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise not_found("User not found")

    if current_user.role.name != UserRole.RRHH.value and current_user.id != user.id:
        raise forbidden("Not authorized to view this user")

    return user

@router.put("/{user_id}")
def update_user(user_id: str, new_data: dict, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_to_update = db.query(User).filter(User.id == user_id).first()
    if not user_to_update:
        raise not_found("User not found")
    
    if current_user.role.name != UserRole.RRHH.value and current_user.id != user_to_update.id:
        raise forbidden("Not authorized")

    for key, value in new_data.items():
        if hasattr(user_to_update, key):
            setattr(user_to_update, key, value)
    db.commit()
    db.refresh(user_to_update)
    return {"message": "User updated"}

@router.delete("/{user_id}")
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_to_delete = db.query(User).filter(User.id == user_id).first()
    if not user_to_delete:
        raise not_found("User not found")

    if current_user.role.name != UserRole.RRHH.value and current_user.id != user_to_delete.id:
        raise forbidden("Not authorized to delete this user")

    db.delete(user_to_delete)
    db.commit()
    return {"message": "User deleted"}