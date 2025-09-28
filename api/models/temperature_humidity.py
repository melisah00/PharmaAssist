from datetime import datetime
from sqlalchemy import Column, Integer, Float, DateTime
from database import Base

class TemperatureHumidityLog(Base):
    __tablename__ = "temperature_humidity_log"

    id = Column(Integer, primary_key=True, index=True)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
