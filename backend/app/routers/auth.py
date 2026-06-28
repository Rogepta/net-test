from fastapi import APIRouter, HTTPException, status

from app import schemas
from app.auth import ADMIN_PASSWORD, ADMIN_USERNAME, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=schemas.TokenResponse)
def login(data: schemas.LoginRequest):
    if data.username != ADMIN_USERNAME or data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверные учётные данные")
    return schemas.TokenResponse(access_token=create_access_token(data.username))
