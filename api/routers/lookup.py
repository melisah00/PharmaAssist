from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db as get_async_db
from models.medicine_models import MedicineType, Supplier
from schemas.lookup import (
    MedicineTypeCreate, MedicineTypeUpdate, MedicineTypeOut,
    SupplierCreate, SupplierUpdate, SupplierOut
)

router = APIRouter(prefix="/lookup", tags=["Lookup"])


@router.get("/medicine-types", response_model=list[MedicineTypeOut])
async def get_medicine_types(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(MedicineType))
    return result.scalars().all()


@router.post("/medicine-types", response_model=MedicineTypeOut)
async def create_medicine_type(data: MedicineTypeCreate, db: AsyncSession = Depends(get_async_db)):
    new_type = MedicineType(**data.dict())
    db.add(new_type)
    await db.commit()
    await db.refresh(new_type)
    return new_type


@router.put("/medicine-types/{id}", response_model=MedicineTypeOut)
async def update_medicine_type(id: int, data: MedicineTypeUpdate, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(MedicineType).where(MedicineType.id == id))
    mt = result.scalars().first()
    if not mt:
        raise HTTPException(status_code=404, detail="MedicineType not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(mt, key, value)

    await db.commit()
    await db.refresh(mt)
    return mt


@router.delete("/medicine-types/{id}")
async def delete_medicine_type(id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(MedicineType).where(MedicineType.id == id))
    mt = result.scalars().first()
    if not mt:
        raise HTTPException(status_code=404, detail="MedicineType not found")
    await db.delete(mt)
    await db.commit()
    return {"detail": "Deleted successfully"}



@router.get("/suppliers", response_model=list[SupplierOut])
async def get_suppliers(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Supplier))
    return result.scalars().all()


@router.post("/suppliers", response_model=SupplierOut)
async def create_supplier(data: SupplierCreate, db: AsyncSession = Depends(get_async_db)):
    new_supplier = Supplier(**data.dict())
    db.add(new_supplier)
    await db.commit()
    await db.refresh(new_supplier)
    return new_supplier


@router.put("/suppliers/{id}", response_model=SupplierOut)
async def update_supplier(id: int, data: SupplierUpdate, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Supplier).where(Supplier.id == id))
    s = result.scalars().first()
    if not s:
        raise HTTPException(status_code=404, detail="Supplier not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(s, key, value)

    await db.commit()
    await db.refresh(s)
    return s


@router.delete("/suppliers/{id}")
async def delete_supplier(id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Supplier).where(Supplier.id == id))
    s = result.scalars().first()
    if not s:
        raise HTTPException(status_code=404, detail="Supplier not found")
    await db.delete(s)
    await db.commit()
    return {"detail": "Deleted successfully"}
