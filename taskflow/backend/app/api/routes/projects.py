# backend/app/api/routes/projects.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_session
from app.services.project_service import ProjectService
from app.services.team_service import TeamService
from app.schemas.schemas import ProjectCreate, ProjectOut
from app.api.routes.auth import decode_token
from app.models.models import Team

router = APIRouter(prefix="/projects", tags=["projects"])

async def get_user_id_from_header(authorization: str | None = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1]
    uid = decode_token(token)
    if uid is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return uid

@router.post("/")
async def create_project(payload: ProjectCreate, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    if payload.team_id:
        team_svc = TeamService(session)
        if not await team_svc.is_member(payload.team_id, user_id):
            raise HTTPException(status_code=403, detail="Not a team member")
    svc = ProjectService(session)
    project = await svc.create_project(payload.name, payload.description, payload.team_id)
    
    # Return with team info
    team = None
    if project.team_id:
        team_result = await session.execute(select(Team).where(Team.id == project.team_id))
        team_obj = team_result.scalar_one_or_none()
        if team_obj:
            team = {"id": team_obj.id, "name": team_obj.name}
    
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "team_id": project.team_id,
        "team": team,
        "status": "active",
        "start_date": None,
        "end_date": None
    }

@router.get("/team/{team_id}")
async def get_projects(team_id: int, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    team_svc = TeamService(session)
    if not await team_svc.is_member(team_id, user_id):
        raise HTTPException(status_code=403, detail="Not a team member")
    svc = ProjectService(session)
    return await svc.list_projects_for_team(team_id)

@router.patch("/{project_id}")
async def update_project(project_id: int, payload: dict, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = ProjectService(session)
    try:
        updated = await svc.update_project(project_id, user_id, **payload)
        return updated
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.delete("/{project_id}")
async def delete_project(project_id: int, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = ProjectService(session)
    try:
        await svc.delete_project(project_id, user_id)
        return {"message": "Project deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
