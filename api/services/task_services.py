
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.task_schemas import TaskCreate, TaskUpdate
from models.user_models import User, Task

from repositories.task_repository import (
    # create_task as repo_create_task,
    get_task_by_id as repo_get_task_by_id,
    repo_create_task,
    to_naive,
    update_task as repo_update_task,
    get_all_tasks as repo_get_all_tasks
)



async def create_task(db: AsyncSession, task_data: TaskCreate):
    task = Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        assigned_to_id=task_data.assigned_to_id,
        created_at=to_naive(task_data.created_at) if task_data.created_at else None,
        due_date=to_naive(task_data.due_date) if task_data.due_date else None
    )
    
    return await repo_create_task(db, task)



async def assign_task(db: AsyncSession, task_id: int, user: User) -> Task | None:
    task = await repo_get_task_by_id(db, task_id)
    if not task:
        return None
    task.assigned_to = user
    return await repo_update_task(db, task)


async def get_tasks(db: AsyncSession):
    return await repo_get_all_tasks(db)


async def update_task(db: AsyncSession, task_id: int, task_update: TaskUpdate) -> Task | None:
    task = await repo_get_task_by_id(db, task_id)
    if not task:
        return None
    for key, value in task_update.dict(exclude_unset=True).items():
        setattr(task, key, value)
    return await repo_update_task(db, task)


async def get_task_by_id(db, task_id: int):
    return await repo_get_task_by_id(db, task_id)

