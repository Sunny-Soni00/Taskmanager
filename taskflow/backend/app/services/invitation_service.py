# backend/app/services/invitation_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.invitation_repo import InvitationRepo
from app.repositories.user_repo import UserRepo
from app.repositories.team_repo import TeamRepo
from app.models.models import Invitation, TeamMember
from typing import List, Dict, Any
from fastapi import HTTPException

class InvitationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.invitation_repo = InvitationRepo(db)
        self.user_repo = UserRepo(db)
        self.team_repo = TeamRepo(db)

    async def create_invitation(
        self, sender_id: int, receiver_id: int, team_id: int
    ) -> Invitation:
        # Validate sender is team owner or member
        team = await self.team_repo.get_by_id(team_id)
        if not team:
            raise HTTPException(status_code=404, detail="Team not found")
        
        team_members = await self.team_repo.get_team_members(team_id)
        member_ids = [m.user_id for m in team_members]
        if sender_id != team.owner_id and sender_id not in member_ids:
            raise HTTPException(status_code=403, detail="Not authorized to send invitations")

        # Validate receiver exists
        receiver = await self.user_repo.get_by_id(receiver_id)
        if not receiver:
            raise HTTPException(status_code=404, detail="User not found")

        # Check if already a member
        if receiver_id in member_ids or receiver_id == team.owner_id:
            raise HTTPException(status_code=400, detail="User is already a team member")

        # Check for existing pending invitation
        existing = await self.invitation_repo.check_existing(receiver_id, team_id)
        if existing:
            raise HTTPException(status_code=400, detail="Invitation already sent")

        invitation = Invitation(
            sender_id=sender_id,
            receiver_id=receiver_id,
            team_id=team_id,
            status="pending"
        )
        return await self.invitation_repo.create(invitation)

    async def get_received_invitations(
        self, user_id: int, status: str = None
    ) -> List[Dict[str, Any]]:
        invitations = await self.invitation_repo.get_by_receiver(user_id, status)
        
        result = []
        for inv in invitations:
            sender = await self.user_repo.get_by_id(inv.sender_id)
            team = await self.team_repo.get_by_id(inv.team_id)
            result.append({
                "id": inv.id,
                "sender": {"id": sender.id, "name": sender.name, "email": sender.email},
                "team": {"id": team.id, "name": team.name},
                "status": inv.status,
                "created_at": inv.created_at.isoformat()
            })
        return result

    async def accept_invitation(self, invitation_id: int, user_id: int) -> Dict[str, Any]:
        invitation = await self.invitation_repo.get_by_id(invitation_id)
        if not invitation:
            raise HTTPException(status_code=404, detail="Invitation not found")
        
        if invitation.receiver_id != user_id:
            raise HTTPException(status_code=403, detail="Not your invitation")
        
        if invitation.status != "pending":
            raise HTTPException(status_code=400, detail="Invitation already processed")

        # Add user to team
        team_member = TeamMember(
            team_id=invitation.team_id,
            user_id=user_id,
            role="member"
        )
        self.db.add(team_member)
        
        # Update invitation status
        invitation.status = "accepted"
        await self.invitation_repo.update(invitation)
        
        return {"message": "Invitation accepted", "team_id": invitation.team_id}

    async def reject_invitation(self, invitation_id: int, user_id: int) -> Dict[str, Any]:
        invitation = await self.invitation_repo.get_by_id(invitation_id)
        if not invitation:
            raise HTTPException(status_code=404, detail="Invitation not found")
        
        if invitation.receiver_id != user_id:
            raise HTTPException(status_code=403, detail="Not your invitation")
        
        if invitation.status != "pending":
            raise HTTPException(status_code=400, detail="Invitation already processed")

        invitation.status = "rejected"
        await self.invitation_repo.update(invitation)
        
        return {"message": "Invitation rejected"}

    async def get_sent_invitations(self, sender_id: int) -> List[Dict[str, Any]]:
        invitations = await self.invitation_repo.get_by_sender(sender_id)
        
        result = []
        for inv in invitations:
            receiver = await self.user_repo.get_by_id(inv.receiver_id)
            team = await self.team_repo.get_by_id(inv.team_id)
            result.append({
                "id": inv.id,
                "receiver": {"id": receiver.id, "name": receiver.name, "email": receiver.email},
                "team": {"id": team.id, "name": team.name},
                "status": inv.status,
                "created_at": inv.created_at.isoformat()
            })
        return result

    async def search_users(self, query: str, current_user_id: int) -> List[Dict[str, Any]]:
        """Search users by name or code_id (excluding current user)"""
        users = await self.user_repo.search_users(query)
        return [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "code_id": u.code_id,
                "profile_picture": u.profile_picture
            }
            for u in users if u.id != current_user_id
        ]
