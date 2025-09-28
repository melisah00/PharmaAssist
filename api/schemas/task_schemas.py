from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

from schemas.user import UserResponse

class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    done = "done"

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    assigned_to_id: Optional[int] = None
    status: TaskStatus = TaskStatus.pending
    created_at: Optional[datetime] = None


class UserRead(BaseModel):
    id: int
    first_name: str
    last_name: str
    role: str

    class Config:
        orm_mode = True


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    assigned_to_id: Optional[int] = None

    class Config:
        orm_mode = True

class TaskRead(TaskBase):
    id: int
    status: TaskStatus
    assigned_to_id: Optional[int]
    assigned_to: Optional[UserRead]  

    class Config:
        orm_mode = True


