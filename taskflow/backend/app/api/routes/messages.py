# backend/app/api/routes/messages.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.api.deps import get_db, get_current_user
from app.services.message_service import MessageService
from app.models.models import User

router = APIRouter()

class SendMessageRequest(BaseModel):
    team_id: int
    message: str
    file_data: str | None = None
    file_name: str | None = None
    file_type: str | None = None

@router.post("/")
async def send_message(
    request: SendMessageRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a message to a team chat"""
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    service = MessageService(db)
    return await service.send_message(
        request.team_id, 
        current_user.id, 
        request.message,
        file_data=request.file_data,
        file_name=request.file_name,
        file_type=request.file_type
    )

@router.get("/{team_id}")
async def get_team_messages(
    team_id: int,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get messages for a team"""
    service = MessageService(db)
    return await service.get_team_messages(team_id, current_user.id, limit)
