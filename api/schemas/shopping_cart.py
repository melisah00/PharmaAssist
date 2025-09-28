from pydantic import BaseModel
from typing import Optional

class ShoppingCartCreate(BaseModel):
    user_id: int
    medicine_id: int
    quantity: int = 1

class ShoppingCartResponse(BaseModel):
    id: int
    user_id: int
    medicine_id: int
    quantity: int

    class Config:
        orm_mode = True


class MedicineInfo(BaseModel):
    id: int
    name: str
    price: float
    image_path: Optional[str]

    class Config:
        orm_mode = True

class ShoppingCartResponseWithMedicine(BaseModel):
    id: int
    user_id: int
    medicine_id: int
    quantity: int
    medicine: MedicineInfo  

    class Config:
        orm_mode = True