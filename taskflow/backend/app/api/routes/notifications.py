# backend/app/api/routes/notifications.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.api.deps import get_db, get_current_user
from app.services.notification_service import NotificationService
from app.models.models import User

router = APIRouter()

class MarkAsReadRequest(BaseModel):
    notification_id: int

@router.get("/")
async def get_notifications(
    unread_only: bool = False,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all notifications for current user"""
    service = NotificationService(db)
    return await service.get_notifications(current_user.id, unread_only)

@router.get("/unread-count")
async def get_unread_count(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get count of unread notifications"""
    service = NotificationService(db)
    count = await service.get_unread_count(current_user.id)
    return {"count": count}

@router.post("/mark-read")
async def mark_as_read(
    request: MarkAsReadRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark a notification as read"""
    service = NotificationService(db)
    return await service.mark_as_read(request.notification_id, current_user.id)

@router.post("/mark-all-read")
async def mark_all_as_read(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark all notifications as read"""
    service = NotificationService(db)
    return await service.mark_all_as_read(current_user.id)
