from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.db.database import SessionLocal
from app.models.cart import CartItem
from app.models.product import Product

router = APIRouter(prefix="/api/cart", tags=["Cart"])


# 🔥 DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# ➕ ADD TO CART (FIXED)
# =========================
@router.post("/add")
def add_to_cart(
    user_id: int,
    product_id: int,
    quantity: int = 1,
    db: Session = Depends(get_db)
):
    # 🔥 CHECK IF PRODUCT EXISTS
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # 🔥 CHECK IF ITEM ALREADY IN CART
    existing = db.query(CartItem).filter(
        CartItem.user_id == user_id,
        CartItem.product_id == product_id
    ).first()

    if existing:
        existing.quantity += quantity
    else:
        new_item = CartItem(
            user_id=user_id,
            product_id=product_id,
            quantity=quantity
        )
        db.add(new_item)

    db.commit()

    return {"message": "Added to cart"}


# =========================
# 📦 GET CART (WITH PRODUCT DATA)
# =========================
@router.get("/{user_id}")
def get_cart(user_id: int, db: Session = Depends(get_db)):
    items = db.query(CartItem).filter(
        CartItem.user_id == user_id
    ).all()

    result = []

    for item in items:
        product = db.query(Product).filter(Product.id == item.product_id).first()

        if product:
            result.append({
                "id": item.id,
                "product_id": product.id,
                "name": product.name,
                "price": product.price,
                "image_url": product.image_url,
                "quantity": item.quantity
            })

    return result


# =========================
# 🔄 UPDATE QUANTITY
# =========================
@router.put("/update/{item_id}")
def update_cart_item(
    item_id: int,
    quantity: int,
    db: Session = Depends(get_db)
):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if quantity <= 0:
        db.delete(item)
    else:
        item.quantity = quantity

    db.commit()

    return {"message": "Cart updated"}


# =========================
# ❌ REMOVE ITEM
# =========================
@router.delete("/remove/{item_id}")
def remove_from_cart(item_id: int, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()

    return {"message": "Item removed"}