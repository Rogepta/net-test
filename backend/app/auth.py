from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.config import settings

_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    return jwt.encode(
        {"sub": subject, "exp": expire}, settings.secret_key, algorithm=settings.algorithm
    )


def require_admin(token: str = Depends(_oauth2_scheme)) -> str:
    invalid = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Недействительный токен"
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        username: str | None = payload.get("sub")
    except JWTError:
        raise invalid
    if username != settings.admin_username:
        raise invalid
    return username
