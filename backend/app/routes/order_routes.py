from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.models.product import Product

router = APIRouter(prefix="/api", tags=["Orders"])


# 🔥 DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔥 CREATE ORDER FROM CART
@router.post("/orders/create/{user_id}")
def create_order(user_id: int, db: Session = Depends(get_db)):
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total = 0

    # create order
    order = Order(user_id=user_id, total=0)
    db.add(order)
    db.commit()
    db.refresh(order)

    order_items_data = []

    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found"
            )

        subtotal = product.price * item.quantity
        total += subtotal

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity
        )
        db.add(order_item)

        order_items_data.append({
            "product_id": product.id,
            "name": product.name,
            "price": product.price,
            "quantity": item.quantity,
            "subtotal": subtotal
        })

    # update total
    order.total = total
    db.commit()

    # 🔥 clear cart
    for item in cart_items:
        db.delete(item)

    db.commit()

    return {
        "message": "Order created successfully",
        "order_id": order.id,
        "total": total,
        "items": order_items_data
    }


# 🔥 GET USER ORDERS
@router.get("/orders/{user_id}")
def get_orders(user_id: int, db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == user_id).all()

    if not orders:
        return []

    result = []

    for order in orders:
        items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()

        order_items = []

        for item in items:
            product = db.query(Product).filter(Product.id == item.product_id).first()

            order_items.append({
                "product_id": item.product_id,
                "name": product.name if product else "Unknown",
                "quantity": item.quantity,
            })

        result.append({
            "order_id": order.id,
            "total": order.total,
            "items": order_items
        })

    return result