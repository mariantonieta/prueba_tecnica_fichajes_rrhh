from fastapi import HTTPException, status
from typing import Any

def bad_request(detail: str = "Bad request") -> HTTPException:
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

def unauthorized(detail: str = "Not authenticated") -> HTTPException:
    return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail,
                         headers={"WWW-Authenticate": "Bearer"})

def forbidden(detail: str = "Not authorized") -> HTTPException:
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

def not_found(detail: str = "Resource not found") -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

def conflict(detail: str = "Conflict") -> HTTPException:
    return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=detail)

class DomainError(Exception):
    def __init__(self, message: str):
        self.message = message