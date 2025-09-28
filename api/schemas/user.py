from datetime import datetime
from enum import Enum
from pydantic import BaseModel, EmailStr
from typing import Optional

from models.user_models import EmployeeStatusEnum

class RoleEnum(str, Enum):
    administrator = 'administrator'
    technician = 'technician'
    customer = 'customer'

class PasswordUpdate(BaseModel):
    old_password: str
    new_password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    password_data: Optional[PasswordUpdate] = None

class PasswordUpdate(BaseModel):
    old_password: str
    new_password: str

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    password: str
    role: RoleEnum = RoleEnum.customer
    status: Optional[EmployeeStatusEnum] = None

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    role: RoleEnum
    created_at: datetime
    status: Optional[EmployeeStatusEnum] = None

class UserLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str