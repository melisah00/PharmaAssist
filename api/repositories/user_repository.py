from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.user_models import EmployeeStatusEnum, RoleEnum, User

async def create_user(db: AsyncSession, user_data: dict):
    new_user = User(**user_data)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

async def get_user_by_username(db: AsyncSession, username: str):
    result = await db.execute(select(User).filter(User.username == username))
    return result.scalar_one_or_none()

async def get_user_by_id(db: AsyncSession, user_id: int):
    result = await db.execute(select(User).filter(User.id == user_id))
    return result.scalar_one_or_none()

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).filter(User.email == email))
    return result.scalar_one_or_none()


async def get_all_technicians(db: AsyncSession):
    result = await db.execute(select(User).filter(User.role == RoleEnum.technician))
    return result.scalars().all()


async def update_user_status(db: AsyncSession, user_id: int, status: EmployeeStatusEnum):
    result = await db.execute(select(User).filter(User.id == user_id, User.role == RoleEnum.technician))
    technician = result.scalar_one_or_none()
    if technician:
        technician.status = status
        await db.commit()
        await db.refresh(technician)
    return technician