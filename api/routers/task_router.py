
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from database import get_db
from repositories.user_repository import get_user_by_id
from services.task_services import assign_task, get_task_by_id, get_tasks, update_task, create_task

from models.user_models import User, Task
from schemas.task_schemas import TaskCreate, TaskRead, TaskUpdate


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)

@router.post("/", response_model=TaskRead)
async def create_new_task(task_data: TaskCreate, db: AsyncSession = Depends(get_db)):
    task = await create_task(db, task_data)
    return task


@router.get("/", response_model=List[TaskRead])
async def list_tasks(db: AsyncSession = Depends(get_db)):
    return await get_tasks(db)

@router.get("/{task_id}", response_model=TaskRead)
async def get_task(task_id: int, db: AsyncSession = Depends(get_db)):
    task = await get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=TaskRead)
async def update_task_endpoint(task_id: int, task_update: TaskUpdate, db: AsyncSession = Depends(get_db)):
    task = await update_task(db, task_id, task_update)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@router.post("/{task_id}/assign/{user_id}", response_model=TaskRead)
async def assign_task_to_employee(task_id: int, user_id: int, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    task = await assign_task(db, task_id, user)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.delete("/{task_id}")
async def delete_task(task_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    await db.delete(task)
    await db.commit()
    return {"message": "Task deleted successfully"}


@router.get("/user/{user_id}", response_model=List[TaskRead])
async def get_tasks_by_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Task)
        .options(selectinload(Task.assigned_to))  # eager load relacija
        .where(Task.assigned_to_id == user_id)
    )
    tasks = result.scalars().all()
    return tasks