from datetime import datetime
from pydantic import BaseModel, Field

class TemperatureHumidityBase(BaseModel):
    temperature: float = Field(..., example=22.5)
    humidity: float = Field(..., example=55.0)

class TemperatureHumidityCreate(TemperatureHumidityBase):
    pass

class TemperatureHumidityUpdate(TemperatureHumidityBase):
    pass

class TemperatureHumidity(TemperatureHumidityBase):
    id: int
    recorded_at: datetime

    class Config:
        orm_mode = True
