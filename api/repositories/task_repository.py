import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload


from models.user_models import Task

def to_naive(dt: datetime):
    if dt.tzinfo is not None:
        return dt.astimezone(tz=None).replace(tzinfo=None)
    return dt

async def repo_create_task(db: AsyncSession, task: Task):
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task




async def get_all_tasks(db: AsyncSession):
    result = await db.execute(
        select(Task).options(selectinload(Task.assigned_to))
    )
    return result.scalars().all()

async def get_task_by_id(db: AsyncSession, task_id: int):
    result = await db.execute(
        select(Task).options(selectinload(Task.assigned_to)).where(Task.id == task_id)
    )
    return result.scalars().first()


async def update_task(db: AsyncSession, task: Task):
    await db.commit()
    await db.refresh(task)
    return task


async def delete_task(db: AsyncSession, task: Task):
    await db.delete(task)
    await db.commit()
