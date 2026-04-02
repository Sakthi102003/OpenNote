import os
from typing import Any
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "OpenNotes"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE_THIS_SECRET_KEY_FOR_LOCAL_DEV_ONLY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    BACKEND_CORS_ORIGINS: list[str] | str = ["http://localhost:5173", "http://localhost:3000"] # Allow Vite dev server

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> list[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Use SQLite for simplicity by default, but ready for Postgres
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

    class Config:
        env_file = ".env"

settings = Settings()
