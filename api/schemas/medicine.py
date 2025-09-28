from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from enum import Enum

class MedicineBase(BaseModel):
    name: str
    dosage_form: Optional[str]
    strength: Optional[str]
    quantity: int
    expiration_date: Optional[date]
    type_id: int
    price: Optional[float]            # NOVO
    image_path: Optional[str]

class MedicineCreate(MedicineBase):
    pass

class MedicineUpdate(BaseModel):
    name: Optional[str]
    dosage_form: Optional[str]
    strength: Optional[str]
    quantity: Optional[int]
    expiration_date: Optional[date]
    type_id: Optional[int]
    price: Optional[float]            
    image_path: Optional[str]

class MedicineOut(MedicineBase):
    id: int
    image_path: Optional[str]

    class Config:
        orm_mode = True