from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import uuid
import secrets
import string

from google.oauth2 import id_token
from google.auth.transport import requests

from ...core import security
from ...core.config import settings
from ...schemas import user as user_schema
from ...models import user as user_model
from ..deps import get_db, get_current_user

router = APIRouter()

@router.post("/register", response_model=user_schema.User)
def register(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(user_model.User).filter(user_model.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = security.get_password_hash(user.password)
    db_user = user_model.User(email=user.email, hashed_password=hashed_password, name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(user_model.User).filter(user_model.User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/google")
def google_auth(token_data: user_schema.GoogleToken, db: Session = Depends(get_db)):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google Client ID is not configured on the server")
        
    try:
        idinfo = id_token.verify_oauth2_token(
            token_data.token, 
            requests.Request(), 
            settings.GOOGLE_CLIENT_ID
        )

        email = idinfo.get('email')
        name = idinfo.get('name')
        picture = idinfo.get('picture')

        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")

        user = db.query(user_model.User).filter(user_model.User.email == email).first()
        
        if not user:
            # Create a random password for OAuth users to satisfy the NOT NULL constraint
            alphabet = string.ascii_letters + string.digits
            random_password = ''.join(secrets.choice(alphabet) for i in range(32))
            hashed_password = security.get_password_hash(random_password)
            
            user = user_model.User(
                email=email,
                name=name,
                hashed_password=hashed_password,
                avatar_url=picture
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Generate standard JWT token for the frontend
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = security.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google Auth token",
        )

@router.get("/me", response_model=user_schema.User)
def read_users_me(current_user: user_model.User = Depends(get_current_user)):
    return current_user
