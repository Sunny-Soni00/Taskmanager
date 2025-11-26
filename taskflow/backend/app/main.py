# backend/app/main.py
import asyncio
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import init_db
from app.api.routes import auth, teams, projects, tasks, invitations, notifications, messages

app = FastAPI(title="Task Manager API")

# Get allowed origins from environment or use defaults
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,https://sunny-soni00.github.io"
).split(",")

# Add CORS middleware FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    # initialize DB (create tables)
    await init_db()

# include routers
app.include_router(auth.router)
app.include_router(teams.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(invitations.router, prefix="/invitations", tags=["invitations"])
app.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
app.include_router(messages.router, prefix="/messages", tags=["messages"])
