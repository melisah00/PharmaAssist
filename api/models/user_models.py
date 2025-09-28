from datetime import datetime
from enum import Enum
from sqlalchemy import (
    Column,
    Float,
    Integer,
    String,
    Boolean,
    DateTime,
    Enum as SqlEnum,
    ForeignKey,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from database import Base 


class RoleEnum(str, Enum):
    administrator = "administrator"
    technician = "technician"
    customer = "customer"


class EmployeeStatusEnum(str, Enum):
    active = "active"
    on_leave = "on_leave"
    vacation = "vacation"


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    username = Column(String, nullable=False, unique=True, index=True)
    email = Column(String, nullable=False, unique=True)
    hashed_password = Column(String, nullable=False)
    role = Column(SqlEnum(RoleEnum), nullable=False, default=RoleEnum.customer)
    status = Column(
        SqlEnum(EmployeeStatusEnum), nullable=True, default=EmployeeStatusEnum.active
    )
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)

    tasks = relationship(
        "Task",
        back_populates="assigned_to",
        cascade="all, delete-orphan",
    )
    work_hours = relationship(
        "WorkHour",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    notifications = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan",
    )


class TaskStatus(Enum):
    pending = "pending"
    in_progress = "in_progress"
    done = "done"


class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    due_date = Column(DateTime, nullable=True)
    status = Column(SqlEnum(TaskStatus), default=TaskStatus.pending, nullable=False)

    assigned_to_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    assigned_to = relationship(
        "User",
        back_populates="tasks",
    )
    notifications = relationship(
        "Notification",
        back_populates="task",
        cascade="all, delete-orphan",
    )


class WorkHour(Base):
    __tablename__ = "work_hours"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow, nullable=False)
    hours = Column(Float, nullable=False)

    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    user = relationship(
        "User",
        back_populates="work_hours",
    )


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    message = Column(String(250), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)

    user = relationship(
        "User",
        back_populates="notifications",
    )
    task = relationship(
        "Task",
        back_populates="notifications",
    )
