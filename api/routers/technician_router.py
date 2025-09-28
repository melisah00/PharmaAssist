from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.user import UserResponse, UserCreate
from database import get_db

from models.user_models import EmployeeStatusEnum
from services import technician_service
from typing import List

router = APIRouter(prefix="/technicians", tags=["Technicians"])


@router.get("/", response_model=List[UserResponse])
async def get_technicians(db: AsyncSession = Depends(get_db)):
    return await technician_service.get_all_technicians(db)


@router.post("/", response_model=UserResponse)
async def create_technician(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await technician_service.create_technician(user, db)


@router.put("/{tech_id}/status", response_model=UserResponse)
async def update_status(tech_id: int, status: EmployeeStatusEnum, db: AsyncSession = Depends(get_db)):
    return await technician_service.update_technician_status(tech_id, status, db)
