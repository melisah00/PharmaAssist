from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.user import UserCreate
from services.auth import get_password_hash
from repositories import user_repository
from models.user_models import EmployeeStatusEnum, RoleEnum



async def get_all_technicians(db: AsyncSession):
    return await user_repository.get_all_technicians(db)


async def create_technician(user: UserCreate, db: AsyncSession):
    existing = await user_repository.get_user_by_username(db, user.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")

    existing_email = await user_repository.get_user_by_email(db, user.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username,
        "email": user.email,
        "hashed_password": get_password_hash(user.password),
        "role": RoleEnum.technician,
        "status": user.status or EmployeeStatusEnum.active,
    }

    return await user_repository.create_user(db, user_data)


async def update_technician_status(tech_id: int, status: EmployeeStatusEnum, db: AsyncSession):
    technician = await user_repository.update_user_status(db, tech_id, status)
    if not technician:
        raise HTTPException(status_code=404, detail="Technician not found")
    return technician
