import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "OpenNotes"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE_THIS_SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Use SQLite for simplicity by default, but ready for Postgres
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

    class Config:
        env_file = ".env"

settings = Settings()
