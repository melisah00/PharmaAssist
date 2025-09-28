from pydantic import BaseModel, EmailStr
from typing import Optional


class MedicineTypeBase(BaseModel):
    name: str
    description: Optional[str] = None


class MedicineTypeCreate(MedicineTypeBase):
    pass


class MedicineTypeUpdate(MedicineTypeBase):
    pass


class MedicineTypeOut(MedicineTypeBase):
    id: int

    class Config:
        from_attributes = True  
        

class SupplierBase(BaseModel):
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None


class SupplierCreate(SupplierBase):
    pass


class SupplierUpdate(SupplierBase):
    pass


class SupplierOut(SupplierBase):
    id: int

    class Config:
        from_attributes = True
