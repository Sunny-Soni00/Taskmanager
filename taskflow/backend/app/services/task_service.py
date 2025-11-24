# backend/app/services/task_service.py
from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.task_repo import TaskRepo
from app.models.models import Task
from app.repositories.project_repo import ProjectRepo

class TaskService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = TaskRepo(session)
        self.project_repo = ProjectRepo(session)

    async def create_task(self, title: str, created_by: int, project_id: Optional[int] = None, **kwargs) -> Task:
        # validate project if provided
        if project_id is not None:
            proj = await self.project_repo.get_by_id(project_id)
            if not proj:
                raise ValueError("Project not found")

        task = Task(
            project_id=project_id,
            title=title,
            description=kwargs.get("description"),
            assignee_id=kwargs.get("assignee_id"),
            priority=kwargs.get("priority", "medium"),
            status="todo",
            due_date=kwargs.get("due_date"),
            estimate_minutes=kwargs.get("estimate_minutes"),
            tags=kwargs.get("tags"),
            created_by=created_by,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        return await self.repo.create(task)

    async def list_tasks_for_project(self, project_id: int) -> List[Task]:
        return await self.repo.list_by_project(project_id)

    async def list_tasks_for_user(self, user_id: int) -> List[Task]:
        return await self.repo.list_by_user(user_id)

    async def get_task(self, task_id: int) -> Optional[Task]:
        return await self.repo.get_by_id(task_id)

    async def update_task(self, task_id: int, **changes) -> Task:
        task = await self.repo.get_by_id(task_id)
        if not task:
            raise ValueError("Task not found")
        allowed = {"title", "description", "assignee_id", "priority", "status", "due_date", "estimate_minutes", "tags"}
        for k, v in changes.items():
            if k in allowed and v is not None:
                setattr(task, k, v)
        task.updated_at = datetime.utcnow()
        return await self.repo.update(task)

    async def change_status(self, task_id: int, new_status: str) -> Task:
        if new_status not in {"todo", "in-progress", "done"}:
            raise ValueError("Invalid status")
        return await self.update_task(task_id, status=new_status)

    async def assign(self, task_id: int, user_id: int) -> Task:
        return await self.update_task(task_id, assignee_id=user_id)

    async def delete_task(self, task_id: int, user_id: int) -> None:
        """Delete a task - only creator or assignee can delete"""
        task = await self.repo.get_by_id(task_id)
        if not task:
            raise ValueError("Task not found")
        # Check permission: only creator or admin can delete
        if task.created_by != user_id:
            raise PermissionError("You don't have permission to delete this task")
        await self.repo.delete(task)

    async def list_all_user_tasks(self, user_id: int) -> List[Task]:
        """Get all tasks created by or assigned to user, including tasks without projects"""
        return await self.repo.list_all_by_user(user_id)
