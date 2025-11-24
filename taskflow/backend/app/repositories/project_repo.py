# backend/app/repositories/project_repo.py
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import Project

class ProjectRepo:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, project: Project) -> Project:
        self.session.add(project)
        await self.session.commit()
        await self.session.refresh(project)
        return project

    async def list_for_team(self, team_id: int) -> List[dict]:
        """Get projects for a team with team details"""
        from app.models.models import Team
        q = select(Project).where(Project.team_id == team_id)
        res = await self.session.execute(q)
        projects = res.scalars().all()
        
        # Get team info
        team_q = select(Team).where(Team.id == team_id)
        team_res = await self.session.execute(team_q)
        team = team_res.scalar_one_or_none()
        
        result = []
        for project in projects:
            result.append({
                "id": project.id,
                "name": project.name,
                "description": project.description,
                "team_id": project.team_id,
                "team": {
                    "id": team.id,
                    "name": team.name
                } if team else None,
                "status": "active",  # Default status
                "start_date": None,
                "end_date": None
            })
        return result

    async def get_by_id(self, project_id: int) -> Optional[Project]:
        q = select(Project).where(Project.id == project_id)
        res = await self.session.execute(q)
        return res.scalars().first()

    async def update(self, project: Project) -> Project:
        self.session.add(project)
        await self.session.commit()
        await self.session.refresh(project)
        return project

    async def delete(self, project: Project) -> None:
        await self.session.delete(project)
        await self.session.commit()
