# backend/app/api/routes/invitations.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Optional
from app.api.deps import get_db, get_current_user
from app.services.invitation_service import InvitationService
from app.models.models import User

router = APIRouter()

class CreateInvitationRequest(BaseModel):
    receiver_id: int
    team_id: int

class InvitationActionRequest(BaseModel):
    invitation_id: int

class UserSearchResponse(BaseModel):
    id: int
    name: str
    email: str
    code_id: str

@router.post("/")
async def create_invitation(
    request: CreateInvitationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send an invitation to join a team"""
    service = InvitationService(db)
    invitation = await service.create_invitation(
        sender_id=current_user.id,
        receiver_id=request.receiver_id,
        team_id=request.team_id
    )
    return {
        "id": invitation.id,
        "status": invitation.status,
        "created_at": invitation.created_at.isoformat()
    }

@router.get("/received")
async def get_received_invitations(
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get invitations received by current user"""
    service = InvitationService(db)
    return await service.get_received_invitations(current_user.id, status)

@router.get("/sent")
async def get_sent_invitations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get invitations sent by current user"""
    service = InvitationService(db)
    return await service.get_sent_invitations(current_user.id)

@router.post("/accept")
async def accept_invitation(
    request: InvitationActionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Accept an invitation"""
    service = InvitationService(db)
    return await service.accept_invitation(request.invitation_id, current_user.id)

@router.post("/reject")
async def reject_invitation(
    request: InvitationActionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Reject an invitation"""
    service = InvitationService(db)
    return await service.reject_invitation(request.invitation_id, current_user.id)

@router.get("/search-users")
async def search_users(
    q: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Search for users by name or code_id"""
    if not q or len(q) < 2:
        raise HTTPException(status_code=400, detail="Query must be at least 2 characters")
    
    service = InvitationService(db)
    return await service.search_users(q, current_user.id)
