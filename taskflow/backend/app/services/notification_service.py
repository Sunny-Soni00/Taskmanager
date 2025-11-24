# backend/app/services/notification_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.notification_repo import NotificationRepo
from app.models.models import Notification
from typing import List, Dict, Any

class NotificationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.notification_repo = NotificationRepo(db)

    async def create_notification(
        self, user_id: int, type: str, title: str, message: str, related_id: int = None
    ) -> Notification:
        notification = Notification(
            user_id=user_id,
            type=type,
            title=title,
            message=message,
            related_id=related_id,
            is_read=0
        )
        return await self.notification_repo.create(notification)

    async def get_notifications(self, user_id: int, unread_only: bool = False) -> List[Dict[str, Any]]:
        notifications = await self.notification_repo.get_by_user(user_id, unread_only)
        return [
            {
                "id": n.id,
                "type": n.type,
                "title": n.title,
                "message": n.message,
                "related_id": n.related_id,
                "is_read": bool(n.is_read),
                "created_at": n.created_at.isoformat()
            }
            for n in notifications
        ]

    async def mark_as_read(self, notification_id: int, user_id: int) -> Dict[str, Any]:
        notification = await self.notification_repo.get_by_id(notification_id)
        if not notification or notification.user_id != user_id:
            return {"success": False, "message": "Notification not found"}
        
        await self.notification_repo.mark_as_read(notification_id)
        return {"success": True, "message": "Notification marked as read"}

    async def mark_all_as_read(self, user_id: int) -> Dict[str, Any]:
        count = await self.notification_repo.mark_all_as_read(user_id)
        return {"success": True, "count": count, "message": f"{count} notifications marked as read"}

    async def get_unread_count(self, user_id: int) -> int:
        return await self.notification_repo.get_unread_count(user_id)

    async def notify_task_assigned(self, assignee_id: int, task_id: int, task_title: str, assigner_name: str):
        """Create notification when a task is assigned"""
        await self.create_notification(
            user_id=assignee_id,
            type="task_assigned",
            title="New Task Assigned",
            message=f"{assigner_name} assigned you to task: {task_title}",
            related_id=task_id
        )

    async def notify_task_updated(self, user_id: int, task_id: int, task_title: str, updater_name: str):
        """Create notification when a task is updated"""
        await self.create_notification(
            user_id=user_id,
            type="task_updated",
            title="Task Updated",
            message=f"{updater_name} updated task: {task_title}",
            related_id=task_id
        )

    async def notify_project_created(self, user_id: int, project_id: int, project_name: str, creator_name: str):
        """Create notification when a new project is created"""
        await self.create_notification(
            user_id=user_id,
            type="project_created",
            title="New Project Created",
            message=f"{creator_name} created project: {project_name}",
            related_id=project_id
        )
