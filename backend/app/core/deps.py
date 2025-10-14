from fastapi import Depends
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

from app.database import get_db
from app.crud.user import get_user_by_id
from app.core.config import settings
from app.core.exceptions import unauthorized, forbidden
from app.schemas.enum import UserRole


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def decode_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        raise unauthorized("Could not validate credentials")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_token(token)
    user_id = payload.get("sub")

    if not user_id:
        raise unauthorized("Invalid authentication payload")

    user = get_user_by_id(db, user_id)
    if not user:
        raise unauthorized("User not found")

    if not user.is_active:
        raise unauthorized("User account is inactive")

    return user


def require_role(min_role: UserRole):
    def _require_role(current_user = Depends(get_current_user)):
        role_name = getattr(current_user.role, "name", None)

        if not role_name:
            raise forbidden("User has no role assigned")

        if role_name == UserRole.RRHH.value:
            return current_user

        if min_role == UserRole.EMPLOYEE:
            return current_user

        raise forbidden(f"This endpoint requires {min_role.value} role")

    return _require_role


def require_rrhh(current_user = Depends(get_current_user)):
    if current_user.role.name != UserRole.RRHH.value:
        raise forbidden("Only HR can perform this action")
    return current_user
