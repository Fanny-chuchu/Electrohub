from sqlalchemy.orm import Session
from ..models.product import Product
from ..models.category import Category

def get_products(db: Session, search: str = None, category: str = None):
    query = db.query(Product)

    # 🔍 search filter
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    # 📦 category filter (JOIN REQUIRED)
    if category:
        query = query.join(Category).filter(Category.name.ilike(f"%{category}%"))

    return query.all()