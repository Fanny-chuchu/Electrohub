from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session, joinedload
import os
import uuid
import shutil

from ..db.database import SessionLocal
from ..models.product import Product as ProductModel
from ..models.category import Category

router = APIRouter(prefix="/api", tags=["Products"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# =========================
# 🔥 DB DEPENDENCY
# =========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# ➕ CREATE PRODUCT
# =========================
@router.post("/products")
def create_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category_id: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    existing = db.query(ProductModel).filter(ProductModel.name == name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product already exists")

    # 🔥 Validate category exists
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # 🔥 Save image
    filename = f"{uuid.uuid4()}_{image.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    new_product = ProductModel(
        name=name,
        description=description,
        price=price,
        category_id=category_id,
        image_url=f"/uploads/{filename}"
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {
        "message": "Product created successfully",
        "id": new_product.id
    }


# =========================
# 📦 GET PRODUCTS (FIXED)
# =========================
@router.get("/products")
def get_products(
    search: str = None,
    category: str = None,  # 🔥 accept string
    db: Session = Depends(get_db)
):
    query = db.query(ProductModel).options(joinedload(ProductModel.category))

    # 🔍 SEARCH
    if search:
        query = query.filter(ProductModel.name.ilike(f"%{search}%"))

    # 🎯 CATEGORY FILTER (FIXED)
    if category:
        try:
            category_id = int(category)
            query = query.filter(ProductModel.category_id == category_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid category")

    products = query.all()

    # 🔥 CLEAN RESPONSE
    result = []
    for p in products:
        result.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "image_url": p.image_url,
            "category_id": p.category_id,
            "category": {
                "id": p.category.id,
                "name": p.category.name
            } if p.category else None
        })

    return result


# =========================
# 🔍 GET SINGLE PRODUCT
# =========================
@router.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(ProductModel).options(
        joinedload(ProductModel.category)
    ).filter(ProductModel.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "image_url": product.image_url,
        "category": {
            "id": product.category.id,
            "name": product.category.name
        } if product.category else None
    }


# =========================
# ✏️ UPDATE PRODUCT
# =========================
@router.put("/products/{product_id}")
def update_product(
    product_id: int,
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category_id: int = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # 🔥 Validate category
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    product.name = name
    product.description = description
    product.price = price
    product.category_id = category_id

    # 🔥 Update image (optional)
    if image:
        filename = f"{uuid.uuid4()}_{image.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        product.image_url = f"/uploads/{filename}"

    db.commit()
    db.refresh(product)

    return {"message": "Product updated successfully"}


# =========================
# ❌ DELETE PRODUCT
# =========================
@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted"}