# backend/app/services/project_service.py
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.project_repo import ProjectRepo
from app.models.models import Project

class ProjectService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = ProjectRepo(session)

    async def create_project(self, name: str, description: Optional[str], team_id: Optional[int] = None) -> Project:
        project = Project(name=name, description=description, team_id=team_id)
        return await self.repo.create(project)

    async def list_projects_for_team(self, team_id: int) -> List[dict]:
        return await self.repo.list_for_team(team_id)

    async def get_project(self, project_id: int) -> Optional[Project]:
        return await self.repo.get_by_id(project_id)

    async def update_project(self, project_id: int, user_id: int, **changes) -> Project:
        """Update project - check team membership for permission"""
        project = await self.repo.get_by_id(project_id)
        if not project:
            raise ValueError("Project not found")
        
        # If project belongs to a team, check membership
        if project.team_id:
            from app.services.team_service import TeamService
            team_svc = TeamService(self.session)
            if not await team_svc.is_member(project.team_id, user_id):
                raise PermissionError("You don't have permission to update this project")
        
        allowed = {"name", "description"}
        for k, v in changes.items():
            if k in allowed and v is not None:
                setattr(project, k, v)
        return await self.repo.update(project)

    async def delete_project(self, project_id: int, user_id: int) -> None:
        """Delete project - check team membership for permission"""
        project = await self.repo.get_by_id(project_id)
        if not project:
            raise ValueError("Project not found")
        
        # If project belongs to a team, check if user is team owner
        if project.team_id:
            from app.services.team_service import TeamService
            team_svc = TeamService(self.session)
            team = await team_svc.team_repo.get_by_id(project.team_id)
            if team and team.owner_id != user_id:
                raise PermissionError("Only team owner can delete projects")
        
        await self.repo.delete(project)
