from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
import os
import uuid
import shutil

from app.db.database import SessionLocal
from app.models.banner import Banner

router = APIRouter(prefix="/api", tags=["Banners"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔥 CREATE BANNER
@router.post("/banners")
def create_banner(
    type: str = Form(...),  # hero or footer

    # HERO / FOOTER fields
    smallText: str = Form(None),
    midText: str = Form(None),
    largeText1: str = Form(None),
    largeText2: str = Form(None),
    desc: str = Form(None),
    discount: str = Form(None),
    saleTime: str = Form(None),
    buttonText: str = Form(None),
    product: int = Form(...),

    image: UploadFile = File(...),

    db: Session = Depends(get_db)
):
    filename = f"{uuid.uuid4()}_{image.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    banner = Banner(
        type=type,
        smallText=smallText,
        midText=midText,
        largeText1=largeText1,
        largeText2=largeText2,
        desc=desc,
        discount=discount,
        saleTime=saleTime,
        buttonText=buttonText,
        product=product,
        image=f"/uploads/{filename}"
    )

    db.add(banner)
    db.commit()
    db.refresh(banner)

    return banner


# 🔥 GET BANNER BY TYPE
@router.get("/banners/{type}")
def get_banner(type: str, db: Session = Depends(get_db)):
    return db.query(Banner).filter(Banner.type == type).first()