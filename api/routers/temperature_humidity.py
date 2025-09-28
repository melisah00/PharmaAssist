import io
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db as get_async_db
from models.temperature_humidity import TemperatureHumidityLog
from schemas.temperature_humidity import TemperatureHumidity, TemperatureHumidityCreate, TemperatureHumidityUpdate
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

router = APIRouter(prefix="/temperature-humidity", tags=["TemperatureHumidity"])

@router.get("/pdf")
async def generate_pdf(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(TemperatureHumidityLog).order_by(TemperatureHumidityLog.recorded_at.desc()))
    logs = result.scalars().all()

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(200, 750, "Temperature & Humidity Logs")
    
    c.setFont("Helvetica", 12)
    y = 720
    for log in logs:
        c.drawString(50, y, f"{log.id} | Temp: {log.temperature}°C | Humidity: {log.humidity}% | {log.recorded_at}")
        y -= 20
        if y < 50:
            c.showPage()
            y = 750

    c.save()
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "inline; filename=temperature_humidity.pdf"})
@router.get("/", response_model=list[TemperatureHumidity])
async def read_logs(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(TemperatureHumidityLog).order_by(TemperatureHumidityLog.recorded_at.desc()))
    logs = result.scalars().all()
    return logs



@router.get("/{log_id}", response_model=TemperatureHumidity)
async def read_log(log_id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(TemperatureHumidityLog).filter(TemperatureHumidityLog.id == log_id))
    log = result.scalars().first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log

@router.post("/", response_model=TemperatureHumidity)
async def create_log(log: TemperatureHumidityCreate, db: AsyncSession = Depends(get_async_db)):
    db_log = TemperatureHumidityLog(
        temperature=log.temperature,
        humidity=log.humidity,
        recorded_at=datetime.utcnow()
    )
    db.add(db_log)
    await db.commit()
    await db.refresh(db_log)
    return db_log

@router.put("/{log_id}", response_model=TemperatureHumidity)
async def update_log(log_id: int, log: TemperatureHumidityUpdate, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(TemperatureHumidityLog).filter(TemperatureHumidityLog.id == log_id))
    db_log = result.scalars().first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    db_log.temperature = log.temperature
    db_log.humidity = log.humidity
    await db.commit()
    await db.refresh(db_log)
    return db_log

@router.delete("/{log_id}", response_model=TemperatureHumidity)
async def delete_log(log_id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(TemperatureHumidityLog).filter(TemperatureHumidityLog.id == log_id))
    db_log = result.scalars().first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    await db.delete(db_log)
    await db.commit()
    return db_log


