from urllib.request import Request
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, user
from app.core.exceptions import DomainError
import os 
import logging

app = FastAPI(title="RRHH API")

FRONTEND_URL = os.getenv("FRONTEND_URL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rrhh_api")


@app.exception_handler(DomainError)
async def domain_error_handler(request: Request, exc: DomainError):

    logger.warning(f"DomainError: {exc.message} - Path: {request.url.path}")
    return JSONResponse(
        status_code=400,
        content={"detail": exc.message, "type": "DomainError"},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
  
    logger.error(f"Unhandled error at {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please contact support."},
    )


app.include_router(auth.router)
app.include_router(user.router)