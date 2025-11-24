# backend/app/repositories/user_repo.py
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.models.models import User

class UserRepo:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user: User) -> User:
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def get_by_email(self, email: str) -> Optional[User]:
        q = select(User).where(User.email == email)
        res = await self.session.execute(q)
        return res.scalars().first()

    async def get_by_id(self, user_id: int) -> Optional[User]:
        q = select(User).where(User.id == user_id)
        res = await self.session.execute(q)
        return res.scalars().first()

    async def get_by_code(self, code: str) -> Optional[User]:
        q = select(User).where(User.code_id == code)
        res = await self.session.execute(q)
        return res.scalars().first()

    async def update(self, user: User) -> User:
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def search_users(self, query: str) -> List[User]:
        """Search users by name or code_id"""
        q = select(User).where(
            or_(
                User.name.ilike(f"%{query}%"),
                User.code_id.ilike(f"%{query}%")
            )
        )
        res = await self.session.execute(q)
        return list(res.scalars().all())
