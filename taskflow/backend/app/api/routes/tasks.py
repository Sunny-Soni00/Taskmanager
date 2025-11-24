# backend/app/api/routes/tasks.py
from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_session
from app.services.task_service import TaskService
from app.schemas.schemas import TaskCreate, TaskOut
from app.api.routes.auth import decode_token
from datetime import datetime

router = APIRouter(prefix="/tasks", tags=["tasks"])

async def get_user_id_from_header(authorization: str | None = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1]
    uid = decode_token(token)
    if uid is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return uid

@router.post("/", response_model=TaskOut)
async def create_task(payload: TaskCreate, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = TaskService(session)
    due = payload.due_date
    task = await svc.create_task(title=payload.title, created_by=user_id, project_id=payload.project_id,
                                 description=payload.description, assignee_id=payload.assignee_id,
                                 priority=payload.priority, due_date=due)
    return task

@router.get("/project/{project_id}")
async def list_tasks(project_id: int, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = TaskService(session)
    tasks = await svc.list_tasks_for_project(project_id)
    return tasks

@router.patch("/{task_id}")
async def update_task(task_id: int, payload: dict, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = TaskService(session)
    try:
        updated = await svc.update_task(task_id, **payload)
        return updated
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.patch("/{task_id}/status")
async def change_status(task_id: int, status: str = Query(...), session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = TaskService(session)
    try:
        updated = await svc.change_status(task_id, new_status=status)
        return updated
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{task_id}")
async def delete_task(task_id: int, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = TaskService(session)
    try:
        await svc.delete_task(task_id, user_id)
        return {"message": "Task deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.get("/user/all")
async def list_all_user_tasks(session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    """Get all tasks created by or assigned to the user, including tasks without projects"""
    svc = TaskService(session)
    tasks = await svc.list_all_user_tasks(user_id)
    return tasks
