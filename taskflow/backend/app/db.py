# backend/app/db.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import DATABASE_URL
import sqlite3
import os

engine = create_async_engine(DATABASE_URL, echo=False, future=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)
Base = declarative_base()

def apply_migrations():
    """Apply migrations to add missing columns without deleting data"""
    db_path = DATABASE_URL.replace('sqlite+aiosqlite:///', '')
    
    if not os.path.exists(db_path):
        print("Database doesn't exist yet, will be created")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    migrations = []
    
    # Check and add status column to team_members
    try:
        cursor.execute("PRAGMA table_info(team_members)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'status' not in columns:
            cursor.execute("ALTER TABLE team_members ADD COLUMN status TEXT DEFAULT 'active'")
            migrations.append("Added 'status' column to team_members")
        
        if 'left_at' not in columns:
            cursor.execute("ALTER TABLE team_members ADD COLUMN left_at TEXT")
            migrations.append("Added 'left_at' column to team_members")
        
        if migrations:
            # Update existing members to active status
            cursor.execute("UPDATE team_members SET status = 'active' WHERE status IS NULL")
            conn.commit()
    except Exception as e:
        print(f"Migration error: {e}")
        conn.rollback()
    finally:
        conn.close()
    
    if migrations:
        print("✅ Applied migrations:")
        for m in migrations:
            print(f"  - {m}")

async def init_db():
    # Apply any pending migrations first
    apply_migrations()
    
    # create tables (sync operation via run_sync)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_session():
    async with AsyncSessionLocal() as session:
        yield session
