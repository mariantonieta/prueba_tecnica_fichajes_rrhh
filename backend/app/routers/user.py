from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate
from app.crud import user as crud_user
from app.core.exceptions import not_found
from uuid import UUID

router = APIRouter(prefix="/users", tags=["users"])

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
def update_user(
    user_id: UUID,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise not_found(status_code=404, detail="User not found")

    # Actualizamos solo los campos que vienen
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    crud_user.delete_user(db, user_id, current_user)
    return {"message": "User deleted"}
