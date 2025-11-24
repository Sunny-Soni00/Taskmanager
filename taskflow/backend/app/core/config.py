# backend/app/core/config.py
from datetime import timedelta

SECRET_KEY = "dev-secret-change-me"  # change before production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 12  # 12 hours
DATABASE_URL = "sqlite+aiosqlite:///./taskflow.db"