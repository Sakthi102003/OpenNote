from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session
from ..core import security
from ..core.config import settings
from ..core.database import SessionLocal, get_db
from ..models import user as user_model

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user(
    db: Session = Depends(get_db),
) -> user_model.User:
    # Bypass authentication for testing
    user = db.query(user_model.User).first()
    if not user:
        # Create a dummy user if none exists
        user = user_model.User(
            email="test@example.com",
            hashed_password="dummy_password_hash",
            name="Test User"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
