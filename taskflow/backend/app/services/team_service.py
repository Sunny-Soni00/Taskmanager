# backend/app/services/team_service.py
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.team_repo import TeamRepo, TeamMemberRepo
from app.models.models import Team, TeamMember
import random
import string

class TeamService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.team_repo = TeamRepo(session)
        self.member_repo = TeamMemberRepo(session)

    def _generate_team_code(self) -> str:
        """Generate a random 4-character alphanumeric team code"""
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))

    async def create_team(self, name: str, owner_id: int) -> Team:
        # Generate unique team code
        team_code = self._generate_team_code()
        # Check if code already exists and regenerate if needed
        while await self.team_repo.get_by_team_code(team_code):
            team_code = self._generate_team_code()
        
        team = Team(name=name, owner_id=owner_id, team_code=team_code)
        created = await self.team_repo.create(team)
        owner_member = TeamMember(team_id=created.id, user_id=owner_id, role="owner")
        await self.member_repo.add(owner_member)
        return created

    async def add_member_by_code(self, team_id: int, code_id: str):
        # lookup user by code is done in route/service using UserService
        raise NotImplementedError("Add via code handled in routes using multiple repos")

    async def list_teams_for_user(self, user_id: int) -> List[Team]:
        return await self.team_repo.list_for_user(user_id)

    async def is_member(self, team_id: int, user_id: int) -> bool:
        return await self.member_repo.is_member(team_id, user_id)

    async def update_team(self, team_id: int, user_id: int, **changes) -> Team:
        """Update team - only owner can update"""
        team = await self.team_repo.get_by_id(team_id)
        if not team:
            raise ValueError("Team not found")
        
        if team.owner_id != user_id:
            raise PermissionError("Only team owner can update the team")
        
        allowed = {"name", "description"}
        for k, v in changes.items():
            if k in allowed and v is not None:
                setattr(team, k, v)
        return await self.team_repo.update(team)

    async def delete_team(self, team_id: int, user_id: int) -> None:
        """Delete team - only owner can delete"""
        team = await self.team_repo.get_by_id(team_id)
        if not team:
            raise ValueError("Team not found")
        
        if team.owner_id != user_id:
            raise PermissionError("Only team owner can delete the team")
        
        await self.team_repo.delete(team)

    async def leave_team(self, team_id: int, user_id: int) -> None:
        """Leave team - members can leave, but not the owner"""
        team = await self.team_repo.get_by_id(team_id)
        if not team:
            raise ValueError("Team not found")
        
        if team.owner_id == user_id:
            raise PermissionError("Team owner cannot leave. Delete the team instead.")
        
        is_member = await self.member_repo.is_member(team_id, user_id)
        if not is_member:
            raise ValueError("You are not a member of this team")
        
        await self.member_repo.remove_member(team_id, user_id)

    async def get_team_members_with_details(self, team_id: int, user_id: int) -> List[dict]:
        """Get all team members with their details"""
        team = await self.team_repo.get_by_id(team_id)
        if not team:
            raise ValueError("Team not found")
        
        # Check if user is a member
        is_member = await self.member_repo.is_member(team_id, user_id)
        if not is_member and team.owner_id != user_id:
            raise PermissionError("You must be a team member to view members")
        
        members = await self.team_repo.get_team_members_with_user_details(team_id)
        return members
