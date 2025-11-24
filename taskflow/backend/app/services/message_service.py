# backend/app/services/message_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.message_repo import MessageRepo
from app.repositories.team_repo import TeamRepo
from app.repositories.user_repo import UserRepo
from app.models.models import TeamMessage
from typing import List, Dict, Any
from fastapi import HTTPException

class MessageService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.message_repo = MessageRepo(db)
        self.team_repo = TeamRepo(db)
        self.user_repo = UserRepo(db)

    async def send_message(
        self, 
        team_id: int, 
        user_id: int, 
        message_text: str,
        file_data: str = None,
        file_name: str = None,
        file_type: str = None
    ) -> Dict[str, Any]:
        # Verify user is member of team
        team = await self.team_repo.get_by_id(team_id)
        if not team:
            raise HTTPException(status_code=404, detail="Team not found")
        
        team_members = await self.team_repo.get_team_members(team_id)
        member_ids = [m.user_id for m in team_members]
        
        if user_id != team.owner_id and user_id not in member_ids:
            raise HTTPException(status_code=403, detail="Not a team member")

        message = TeamMessage(
            team_id=team_id,
            user_id=user_id,
            message=message_text,
            file_url=file_data,
            file_name=file_name,
            file_type=file_type
        )
        created_message = await self.message_repo.create(message)
        
        user = await self.user_repo.get_by_id(user_id)
        result = {
            "id": created_message.id,
            "team_id": created_message.team_id,
            "user": {
                "id": user.id,
                "name": user.name,
                "profile_picture": user.profile_picture
            },
            "message": created_message.message,
            "created_at": created_message.created_at.isoformat()
        }
        
        if file_data:
            result["file_url"] = created_message.file_url
            result["file_name"] = created_message.file_name
            result["file_type"] = created_message.file_type
            
        return result

    async def get_team_messages(self, team_id: int, user_id: int, limit: int = 100) -> List[Dict[str, Any]]:
        # Verify user is member of team
        team = await self.team_repo.get_by_id(team_id)
        if not team:
            raise HTTPException(status_code=404, detail="Team not found")
        
        team_members = await self.team_repo.get_team_members(team_id)
        member_ids = [m.user_id for m in team_members]
        
        if user_id != team.owner_id and user_id not in member_ids:
            raise HTTPException(status_code=403, detail="Not a team member")

        messages = await self.message_repo.get_by_team(team_id, limit)
        
        result = []
        for msg in messages:
            user = await self.user_repo.get_by_id(msg.user_id)
            msg_data = {
                "id": msg.id,
                "team_id": msg.team_id,
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "profile_picture": user.profile_picture
                },
                "message": msg.message,
                "created_at": msg.created_at.isoformat()
            }
            
            if msg.file_url:
                msg_data["file_url"] = msg.file_url
                msg_data["file_name"] = msg.file_name
                msg_data["file_type"] = msg.file_type
                
            result.append(msg_data)
        return result
