# backend/app/repositories/notification_repo.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import Notification
from typing import List, Optional

class NotificationRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, notification: Notification) -> Notification:
        self.db.add(notification)
        await self.db.commit()
        await self.db.refresh(notification)
        return notification

    async def get_by_id(self, notification_id: int) -> Optional[Notification]:
        result = await self.db.execute(
            select(Notification).where(Notification.id == notification_id)
        )
        return result.scalar_one_or_none()

    async def get_by_user(self, user_id: int, unread_only: bool = False) -> List[Notification]:
        query = select(Notification).where(Notification.user_id == user_id)
        if unread_only:
            query = query.where(Notification.is_read == 0)
        result = await self.db.execute(query.order_by(Notification.created_at.desc()))
        return list(result.scalars().all())

    async def mark_as_read(self, notification_id: int) -> Optional[Notification]:
        notification = await self.get_by_id(notification_id)
        if notification:
            notification.is_read = 1
            await self.db.commit()
            await self.db.refresh(notification)
        return notification

    async def mark_all_as_read(self, user_id: int) -> int:
        """Mark all notifications as read for a user. Returns count of updated notifications."""
        notifications = await self.get_by_user(user_id, unread_only=True)
        for notif in notifications:
            notif.is_read = 1
        await self.db.commit()
        return len(notifications)

    async def delete(self, notification: Notification) -> None:
        await self.db.delete(notification)
        await self.db.commit()

    async def get_unread_count(self, user_id: int) -> int:
        """Get count of unread notifications for a user"""
        notifications = await self.get_by_user(user_id, unread_only=True)
        return len(notifications)
