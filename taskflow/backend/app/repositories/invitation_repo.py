# backend/app/repositories/invitation_repo.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.models.models import Invitation
from typing import List, Optional

class InvitationRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, invitation: Invitation) -> Invitation:
        self.db.add(invitation)
        await self.db.commit()
        await self.db.refresh(invitation)
        return invitation

    async def get_by_id(self, invitation_id: int) -> Optional[Invitation]:
        result = await self.db.execute(
            select(Invitation).where(Invitation.id == invitation_id)
        )
        return result.scalar_one_or_none()

    async def get_by_receiver(self, receiver_id: int, status: Optional[str] = None) -> List[Invitation]:
        query = select(Invitation).where(Invitation.receiver_id == receiver_id)
        if status:
            query = query.where(Invitation.status == status)
        result = await self.db.execute(query.order_by(Invitation.created_at.desc()))
        return list(result.scalars().all())

    async def get_by_sender(self, sender_id: int) -> List[Invitation]:
        result = await self.db.execute(
            select(Invitation)
            .where(Invitation.sender_id == sender_id)
            .order_by(Invitation.created_at.desc())
        )
        return list(result.scalars().all())

    async def check_existing(self, receiver_id: int, team_id: int) -> Optional[Invitation]:
        """Check if there's already a pending invitation for this user to this team"""
        result = await self.db.execute(
            select(Invitation).where(
                and_(
                    Invitation.receiver_id == receiver_id,
                    Invitation.team_id == team_id,
                    Invitation.status == "pending"
                )
            )
        )
        return result.scalar_one_or_none()

    async def update(self, invitation: Invitation) -> Invitation:
        await self.db.commit()
        await self.db.refresh(invitation)
        return invitation

    async def delete(self, invitation: Invitation) -> None:
        await self.db.delete(invitation)
        await self.db.commit()
