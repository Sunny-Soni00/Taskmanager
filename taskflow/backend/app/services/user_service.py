# backend/app/services/user_service.py
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repo import UserRepo
from app.models.models import User

class UserService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = UserRepo(session)

    async def create_user(self, name: str, email: str, password: str, code_id: Optional[str] = None) -> User:
        user = User(name=name, email=email, password=password, code_id=code_id)
        return await self.repo.create(user)

    async def authenticate(self, email: str, password: str) -> Optional[User]:
        user = await self.repo.get_by_email(email)
        if not user:
            return None
        if password != user.password:
            return None
        return user

    async def get_by_id(self, user_id: int) -> Optional[User]:
        return await self.repo.get_by_id(user_id)

    async def get_by_code(self, code: str) -> Optional[User]:
        return await self.repo.get_by_code(code)
