from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session

from ..db.database import SessionLocal
from ..models.category import Category

router = APIRouter(prefix="/api", tags=["Categories"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔥 GET ALL
@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()


# 🔥 CREATE CATEGORY
@router.post("/categories")
def create_category(name: str = Form(...), db: Session = Depends(get_db)):
    existing = db.query(Category).filter(Category.name == name).first()

    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")

    new_category = Category(name=name)

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category


# 🔥 DELETE CATEGORY
@router.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(category)
    db.commit()

    return {"message": "Category deleted"}