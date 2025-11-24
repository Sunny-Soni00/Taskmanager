# backend/app/repositories/message_repo.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import TeamMessage
from typing import List, Optional

class MessageRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, message: TeamMessage) -> TeamMessage:
        self.db.add(message)
        await self.db.commit()
        await self.db.refresh(message)
        return message

    async def get_by_id(self, message_id: int) -> Optional[TeamMessage]:
        result = await self.db.execute(
            select(TeamMessage).where(TeamMessage.id == message_id)
        )
        return result.scalar_one_or_none()

    async def get_by_team(self, team_id: int, limit: int = 100) -> List[TeamMessage]:
        """Get messages for a team, ordered by creation time (newest first)"""
        result = await self.db.execute(
            select(TeamMessage)
            .where(TeamMessage.team_id == team_id)
            .order_by(TeamMessage.created_at.desc())
            .limit(limit)
        )
        messages = list(result.scalars().all())
        return list(reversed(messages))  # Return oldest first for chat display

    async def delete(self, message: TeamMessage) -> None:
        await self.db.delete(message)
        await self.db.commit()
