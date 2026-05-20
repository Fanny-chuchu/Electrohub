from pydantic import BaseModel

class Category(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class Product(BaseModel):
    id: int
    name: str
    description: str
    price: float
    image_url: str
    category_id: int
    category: Category | None

    class Config:
        from_attributes = True