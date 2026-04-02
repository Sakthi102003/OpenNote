import os
import sys

# Ensure backend directory is in the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set a test environment variable with multiple origins separated by commas
test_origins_str = "http://localhost:3000, http://127.0.0.1:8000,https://example.com"
os.environ["BACKEND_CORS_ORIGINS"] = test_origins_str

# Import Settings from the workspace
from app.core.config import Settings

# Instantiate settings to parse from the environment
settings = Settings()

print("Testing BACKEND_CORS_ORIGINS parsing:")
print(f"Raw String from env    : {test_origins_str}")
print(f"Parsed List in settings: {settings.BACKEND_CORS_ORIGINS}")
print("-" * 50)
print(f"Type after parsing     : {type(settings.BACKEND_CORS_ORIGINS)}")
