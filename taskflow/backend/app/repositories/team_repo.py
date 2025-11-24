# backend/app/repositories/team_repo.py
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import Team, TeamMember, User

class TeamRepo:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, team: Team) -> Team:
        self.session.add(team)
        await self.session.commit()
        await self.session.refresh(team)
        return team

    async def get_by_id(self, team_id: int) -> Optional[Team]:
        q = select(Team).where(Team.id == team_id)
        res = await self.session.execute(q)
        return res.scalars().first()

    async def list_for_user(self, user_id: int) -> List[dict]:
        """Get teams for user with member count - only active members"""
        q = select(Team).join(TeamMember, Team.id == TeamMember.team_id).where(
            TeamMember.user_id == user_id,
            TeamMember.status == "active"
        )
        res = await self.session.execute(q)
        teams = res.scalars().all()
        
        result = []
        for team in teams:
            # Count members for this team
            member_q = select(TeamMember).where(TeamMember.team_id == team.id)
            member_res = await self.session.execute(member_q)
            member_count = len(member_res.scalars().all())
            
            result.append({
                "id": team.id,
                "name": team.name,
                "owner_id": team.owner_id,
                "team_code": team.team_code,
                "description": team.description,
                "created_at": team.created_at.isoformat() if team.created_at else None,
                "member_count": member_count
            })
        return result

    async def update(self, team: Team) -> Team:
        self.session.add(team)
        await self.session.commit()
        await self.session.refresh(team)
        return team

    async def delete(self, team: Team) -> None:
        await self.session.delete(team)
        await self.session.commit()

    async def get_by_team_code(self, team_code: str) -> Optional[Team]:
        q = select(Team).where(Team.team_code == team_code)
        res = await self.session.execute(q)
        return res.scalars().first()

    async def get_team_members(self, team_id: int, include_left: bool = False) -> List[TeamMember]:
        q = select(TeamMember).where(TeamMember.team_id == team_id)
        if not include_left:
            q = q.where(TeamMember.status == "active")
        res = await self.session.execute(q)
        return res.scalars().all()

    async def get_team_members_with_user_details(self, team_id: int, include_left: bool = True) -> dict:
        """Get team members with user information, grouped by status"""
        from sqlalchemy.orm import selectinload
        q = select(TeamMember).where(TeamMember.team_id == team_id)
        res = await self.session.execute(q)
        members = res.scalars().all()
        
        # Get user details for each member
        active_members = []
        past_members = []
        
        for member in members:
            user_q = select(User).where(User.id == member.user_id)
            user_res = await self.session.execute(user_q)
            user = user_res.scalars().first()
            if user:
                member_data = {
                    "id": member.id,
                    "role": member.role,
                    "status": member.status,
                    "left_at": member.left_at.isoformat() if member.left_at else None,
                    "user": {
                        "id": user.id,
                        "name": user.name,
                        "email": user.email,
                        "profile_picture": user.profile_picture
                    }
                }
                if member.status == "active":
                    active_members.append(member_data)
                elif include_left:
                    past_members.append(member_data)
        
        return {
            "active": active_members,
            "past": past_members
        }

class TeamMemberRepo:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def add(self, member: TeamMember):
        self.session.add(member)
        await self.session.commit()
        await self.session.refresh(member)
        return member

    async def is_member(self, team_id: int, user_id: int) -> bool:
        q = select(TeamMember).where(
            TeamMember.team_id == team_id, 
            TeamMember.user_id == user_id,
            TeamMember.status == "active"
        )
        res = await self.session.execute(q)
        return res.scalars().first() is not None

    async def remove_member(self, team_id: int, user_id: int) -> None:
        """Mark a member as left instead of deleting"""
        from datetime import datetime
        q = select(TeamMember).where(TeamMember.team_id == team_id, TeamMember.user_id == user_id)
        res = await self.session.execute(q)
        member = res.scalars().first()
        if member:
            member.status = "left"
            member.left_at = datetime.utcnow()
            self.session.add(member)
            await self.session.commit()
