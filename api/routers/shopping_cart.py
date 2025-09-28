from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models.medicine_models import Medicine
from database import get_db as get_async_db
from models.shopping_cart import ShoppingCart
from schemas.shopping_cart import ShoppingCartCreate, ShoppingCartResponse, ShoppingCartResponseWithMedicine
from dependencies import get_current_user
from sqlalchemy.orm import selectinload
router = APIRouter(prefix="/shopping-cart", tags=["Shopping Cart"])


@router.post("/", response_model=ShoppingCartResponseWithMedicine)
async def add_to_cart(
    item: ShoppingCartCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_user)
):
    user_id = current_user.id

    try:
        result = await db.execute(
            select(ShoppingCart)
            .options(selectinload(ShoppingCart.medicine))
            .filter_by(user_id=user_id, medicine_id=item.medicine_id)
        )
        existing_item = result.scalar_one_or_none()

        if existing_item:
            existing_item.quantity += item.quantity
            await db.commit()
            await db.refresh(existing_item)
            return existing_item

        cart_item = ShoppingCart(
            user_id=user_id,
            medicine_id=item.medicine_id,
            quantity=item.quantity
        )
        db.add(cart_item)
        await db.commit()
        await db.refresh(cart_item)
        
        result = await db.execute(
            select(ShoppingCart)
            .options(selectinload(ShoppingCart.medicine))
            .filter_by(id=cart_item.id)
        )
        cart_item_with_medicine = result.scalar_one()
        
        return cart_item_with_medicine
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error adding to cart: {str(e)}")



@router.get("/", response_model=List[ShoppingCartResponseWithMedicine])
async def get_cart(
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_user)
):
    user_id = current_user.id
    try:
        from sqlalchemy.orm import selectinload
        
        result = await db.execute(
            select(ShoppingCart)
            .options(selectinload(ShoppingCart.medicine))
            .filter(ShoppingCart.user_id == user_id)
        )
        items = result.scalars().all()
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/{cart_item_id}")
async def remove_from_cart(
    cart_item_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_user)
):
    user_id = current_user.id
    result = await db.execute(
        select(ShoppingCart).filter_by(id=cart_item_id, user_id=user_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    await db.delete(item)
    await db.commit()
    return {"detail": "Item removed"}


@router.post("/checkout")
async def checkout(
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_user)
):
    user_id = current_user.id

    result = await db.execute(select(ShoppingCart).filter_by(user_id=user_id))
    cart_items = result.scalars().all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    for item in cart_items:
        # provjeri dostupnu količinu lijeka
        med_result = await db.execute(select(Medicine).filter_by(id=item.medicine_id))
        medicine = med_result.scalar_one_or_none()
        if not medicine:
            raise HTTPException(status_code=404, detail="Medicine not found")
        if medicine.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for {medicine.name}. Available: {medicine.quantity}",
            )

        # umanji količinu u tabeli medicine
        medicine.quantity -= item.quantity

        # ukloni item iz korpe
        await db.delete(item)

    await db.commit()
    return {"detail": "Purchase successful! Stock updated."}
