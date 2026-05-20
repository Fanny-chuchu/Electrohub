from sqlalchemy import Column, Integer, String
from app.db.database import Base

class Banner(Base):
    __tablename__ = "banners"

    id = Column(Integer, primary_key=True, index=True)

    type = Column(String)  # "hero" or "footer"

    smallText = Column(String)
    midText = Column(String)
    largeText1 = Column(String)
    largeText2 = Column(String)

    discount = Column(String)
    saleTime = Column(String)

    desc = Column(String)
    buttonText = Column(String)

    product = Column(Integer)
    image = Column(String)