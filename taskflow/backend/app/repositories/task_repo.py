# backend/app/repositories/task_repo.py
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import Task

class TaskRepo:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, task: Task) -> Task:
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        return task

    async def get_by_id(self, task_id: int) -> Optional[Task]:
        q = select(Task).where(Task.id == task_id)
        res = await self.session.execute(q)
        return res.scalars().first()

    async def list_by_project(self, project_id: int) -> List[Task]:
        q = select(Task).where(Task.project_id == project_id)
        res = await self.session.execute(q)
        return res.scalars().all()

    async def list_by_user(self, user_id: int) -> List[Task]:
        q = select(Task).where(Task.assignee_id == user_id)
        res = await self.session.execute(q)
        return res.scalars().all()

    async def update(self, task: Task) -> Task:
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        return task

    async def delete(self, task: Task) -> None:
        await self.session.delete(task)
        await self.session.commit()

    async def list_all_by_user(self, user_id: int) -> List[Task]:
        """Get all tasks created by or assigned to user"""
        q = select(Task).where(
            (Task.created_by == user_id) | (Task.assignee_id == user_id)
        )
        res = await self.session.execute(q)
        return res.scalars().all()
