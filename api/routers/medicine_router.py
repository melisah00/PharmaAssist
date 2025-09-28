# routers/medicine_router.py
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi.responses import StreamingResponse
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import Table, TableStyle, SimpleDocTemplate
from reportlab.lib import colors
from fastapi import UploadFile, File, Form
import shutil
import os
from sqlalchemy import and_

from models.lookup import MedicineType
from database import get_db
from models.medicine_models import Medicine
from dependencies import get_current_user

from schemas.medicine import MedicineCreate, MedicineUpdate, MedicineOut
from services.medicine_services import get_medicines, get_medicine, create_medicine, update_medicine, delete_medicine


router = APIRouter(prefix="/medicine", tags=["Medicine"])

UPLOAD_DIR = "uploaded_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/")
async def get_all_medicines(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Medicine))
    medicines = result.scalars().all()
    return medicines

@router.post("/", response_model=MedicineOut)
async def add_medicine(
    name: str = Form(...),
    dosage_form: str = Form(None),
    strength: str = Form(None),
    quantity: int = Form(...),
    expiration_date: str = Form(None),  
    type_id: int = Form(...),
    price: float = Form(None),
    file: UploadFile = File(None),
    db: AsyncSession = Depends(get_db)
):
    # parsiranje expiration_date u date objekt
    exp_date_obj = None
    if expiration_date:
        try:
            exp_date_obj = datetime.strptime(expiration_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Expiration date must be YYYY-MM-DD")

    db_med = Medicine(
        name=name,
        dosage_form=dosage_form,
        strength=strength,
        quantity=quantity,
        expiration_date=exp_date_obj,
        type_id=type_id,
        price=price,
        image_path=None
    )
    db.add(db_med)
    await db.commit()
    await db.refresh(db_med)

    if file:
        extension = os.path.splitext(file.filename)[1]
        file_path = os.path.join(UPLOAD_DIR, f"medicine_{db_med.id}{extension}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        db_med.image_path = file_path
        db.add(db_med)
        await db.commit()
        await db.refresh(db_med)

    return db_med




@router.put("/{medicine_id}", response_model=dict)
async def edit_medicine(
    medicine_id: int,
    name: str = Form(...),
    dosage_form: str = Form(None),
    strength: str = Form(None),
    quantity: int = Form(...),
    expiration_date: str = Form(None),
    price: float = Form(None),
    type_id: int = Form(...),
    file: UploadFile = File(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Dohvati lijek
    med = await db.get(Medicine, medicine_id)
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")

    # Update polja
    med.name = name
    med.dosage_form = dosage_form
    med.strength = strength
    med.quantity = quantity
    med.price = price
    med.type_id = type_id

    if expiration_date:
        try:
            med.expiration_date = datetime.strptime(expiration_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Expiration date must be YYYY-MM-DD")

    # Ako postoji novi fajl
    if file:
        extension = os.path.splitext(file.filename)[1]
        file_path = os.path.join(UPLOAD_DIR, f"medicine_{med.id}{extension}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        med.image_path = file_path

    db.add(med)
    await db.commit()
    await db.refresh(med)

    return {
        "id": med.id,
        "name": med.name,
        "dosage_form": med.dosage_form,
        "strength": med.strength,
        "quantity": med.quantity,
        "expiration_date": med.expiration_date,
        "price": med.price,
        "type_id": med.type_id,
        "image_path": med.image_path
    }

@router.delete("/{medicine_id}")
async def remove_medicine(medicine_id: int, db: AsyncSession = Depends(get_db)):
    db_med = await get_medicine(db, medicine_id)
    if not db_med:
        raise HTTPException(status_code=404, detail="Medicine not found")
    await delete_medicine(db, medicine_id)
    return {"message": "Medicine deleted successfully"}


@router.get("/medicine-type/")
async def get_medicine_types(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MedicineType))
    medicine_types = result.scalars().all()
    return medicine_types


@router.get("/expiring-soon")
async def get_medicines_expiring_soon(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
   
    today = datetime.today().date()
    three_months_later = today + timedelta(days=90)  # približno 3 mjeseca

    
    stmt = select(Medicine).where(
        and_(
            Medicine.expiration_date != None,
            Medicine.expiration_date.between(today, three_months_later)
        )
    )

    result = await db.execute(stmt)
    medicines = result.scalars().all()
    return medicines

@router.get("/pdf")
async def generate_medicine_pdf(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Medicine))
    medicines = result.scalars().all()

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    data = [["Name", "Form", "Strength", "Quantity", "Expiration Date"]]

    for med in medicines:
        data.append([
            med.name,
            med.dosage_form or "-",
            med.strength or "-",
            med.quantity,
            med.expiration_date.strftime("%Y-%m-%d") if med.expiration_date else "-"
        ])

    table = Table(data, colWidths=[120, 80, 80, 60, 100])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.lightblue),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('ALIGN', (3,1), (-1,-1), 'CENTER')
    ]))

    doc.build([table])
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "inline; filename=medicines.pdf"})
