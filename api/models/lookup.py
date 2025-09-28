from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from database import Base


class MedicineType(Base):
    __tablename__ = "medicine_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)


class Supplier(Base):
    __tablename__ = "supplier"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    address = Column(String, nullable= True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True, unique=True)
    # notes = Column(Text, nullable=True)