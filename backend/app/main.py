from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.db.database import Base, engine

from app.routes.product_routes import router as product_router
from app.routes.category_routes import router as category_router
from app.routes.auth_routes import router as auth_router
from app.routes.cart_routes import router as cart_router
from app.routes.banner_routes import router as banner_router
from app.routes.order_routes import router as order_router
from app.routes.profile_routes import router as profile_router

# 🔥 CREATE APP FIRST
app = FastAPI(title="ElectroHub API")


# 🔥 CORS (allow frontend)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://electrohub-store.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # use ["*"] only in dev if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 🔥 CREATE DATABASE TABLES
Base.metadata.create_all(bind=engine)


# 🔥 SERVE UPLOADED IMAGES
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# 🔥 REGISTER ROUTES
app.include_router(product_router)
app.include_router(category_router)
app.include_router(auth_router)
app.include_router(cart_router)
app.include_router(order_router)
app.include_router(banner_router)
app.include_router(profile_router)

# 🔥 OPTIONAL (TEST ROUTE)
@app.get("/")
def root():
    return {"message": "ElectroHub API running"}