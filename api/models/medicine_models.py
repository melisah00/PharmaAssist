from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base
from models.lookup import MedicineType, Supplier


class Medicine(Base):
    __tablename__ = "medicine"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    manufacturer = Column(String, nullable=True)
    dosage_form = Column(String, nullable=True)  # npr. tableta, kapsula, sirup
    strength = Column(String, nullable=True)  # npr. 500mg
    quantity = Column(Integer, default=0, nullable=False)
    expiration_date = Column(Date, nullable=True)

    type_id = Column(Integer, ForeignKey("medicine_type.id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("supplier.id"), nullable=True)

    type = relationship("MedicineType")
    supplier = relationship("Supplier")

    image_path = Column(String, nullable=True)
    price = Column(Float, nullable=True)

    stock_logs = relationship(
        "StockLog", back_populates="medicine", cascade="all, delete-orphan"
    )


class StockLog(Base):
    __tablename__ = "stock_log"

    id = Column(Integer, primary_key=True, index=True)
    medicine_id = Column(Integer, ForeignKey("medicine.id"), nullable=False)
    change = Column(Integer, nullable=False) 
    reason = Column(String, nullable=True)  
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    medicine = relationship("Medicine", back_populates="stock_logs")
