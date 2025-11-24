# backend/app/api/routes/teams.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_session
from app.services.team_service import TeamService
from app.services.user_service import UserService
from app.schemas.schemas import TeamCreate, AddMemberIn, TeamOut
from app.api.routes.auth import decode_token

router = APIRouter(prefix="/teams", tags=["teams"])

async def get_user_id_from_header(authorization: str | None = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1]
    uid = decode_token(token)
    if uid is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return uid

@router.post("/")
async def create_team(payload: TeamCreate, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = TeamService(session)
    team = await svc.create_team(payload.name, owner_id=user_id)
    # Return team with member_count like /my endpoint
    return {
        "id": team.id,
        "name": team.name,
        "owner_id": team.owner_id,
        "team_code": team.team_code,
        "description": team.description,
        "created_at": team.created_at.isoformat() if team.created_at else None,
        "member_count": 1  # Owner is the first member
    }

@router.post("/{team_id}/add-member")
async def add_member(team_id: int, payload: AddMemberIn, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    # find user by code
    user_svc = UserService(session)
    user = await user_svc.get_by_code(payload.code_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    team_svc = TeamService(session)
    # ensure team exists
    t = await team_svc.team_repo.get_by_id(team_id)
    if not t:
        raise HTTPException(status_code=404, detail="Team not found")
    member = await team_svc.member_repo.add(type("X",(object,),{"team_id":team_id,"user_id":user.id,"role":"member"})())  # quick construct
    return {"member_id": member.id}

@router.get("/my")
async def my_teams(session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = TeamService(session)
    teams = await svc.list_teams_for_user(user_id)
    return teams

@router.patch("/{team_id}")
async def update_team(team_id: int, payload: dict, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = TeamService(session)
    try:
        updated = await svc.update_team(team_id, user_id, **payload)
        return updated
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.delete("/{team_id}")
async def delete_team(team_id: int, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = TeamService(session)
    try:
        await svc.delete_team(team_id, user_id)
        return {"message": "Team deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.post("/{team_id}/leave")
async def leave_team(team_id: int, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = TeamService(session)
    try:
        await svc.leave_team(team_id, user_id)
        return {"message": "Left team successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.get("/{team_id}/members")
async def get_team_members(team_id: int, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_from_header)):
    svc = TeamService(session)
    try:
        members = await svc.get_team_members_with_details(team_id, user_id)
        return members
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
