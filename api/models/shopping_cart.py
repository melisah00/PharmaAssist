from datetime import datetime
from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from models.user_models import User
from models.medicine_models import Medicine

class ShoppingCart(Base):
    __tablename__ = "shopping_cart"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    medicine_id = Column(Integer, ForeignKey("medicine.id"), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    added_at = Column(DateTime, default=datetime.utcnow, nullable=False)

   
    user = relationship("User", back_populates="shopping_cart_items")
    medicine = relationship("Medicine", back_populates="shopping_cart_items")



User.shopping_cart_items = relationship(
    "ShoppingCart",
    back_populates="user",
    cascade="all, delete-orphan",
)


Medicine.shopping_cart_items = relationship(
    "ShoppingCart",
    back_populates="medicine",
    cascade="all, delete-orphan",
)
