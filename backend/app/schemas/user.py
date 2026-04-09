from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    name: Optional[str] = None

class UserLogin(UserBase):
    password: str

class GoogleToken(BaseModel):
    token: str

class User(UserBase):
    id: uuid.UUID
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
