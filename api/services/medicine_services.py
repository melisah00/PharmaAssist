from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from models.medicine_models import Medicine
from pydantic import BaseModel
from datetime import date
from schemas.medicine import MedicineCreate, MedicineUpdate

async def get_medicines(db: AsyncSession) -> List[Medicine]:
    result = await db.execute(select(Medicine))
    return result.scalars().all()

async def get_medicine(db: AsyncSession, medicine_id: int) -> Medicine:
    result = await db.execute(select(Medicine).where(Medicine.id == medicine_id))
    return result.scalar_one_or_none()

async def create_medicine(db: AsyncSession, medicine: MedicineCreate) -> Medicine:
    db_med = Medicine(**medicine.dict())
    db.add(db_med)
    await db.commit()
    await db.refresh(db_med)
    return db_med

async def update_medicine(db: AsyncSession, medicine_id: int, medicine: MedicineUpdate) -> Optional[Medicine]:
    await db.execute(
        update(Medicine)
        .where(Medicine.id == medicine_id)
        .values(**medicine.dict(exclude_unset=True))
    )
    await db.commit()
    return await get_medicine(db, medicine_id)

async def delete_medicine(db: AsyncSession, medicine_id: int):
    med = await db.get(Medicine, medicine_id)
    if not med:
        return None
    await db.delete(med)
    await db.commit()
    return med