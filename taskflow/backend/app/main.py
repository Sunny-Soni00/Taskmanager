# backend/app/main.py
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import init_db
from app.api.routes import auth, teams, projects, tasks, invitations, notifications, messages

app = FastAPI(title="TaskFlow (MVP)")

# Add CORS middleware FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
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
