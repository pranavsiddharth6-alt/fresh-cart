from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.health import router as health_router
from app.api.categories import router as categories_router
from app.api.products import router as products_router
from app.api.orders import router as orders_router
from app.api.profile import router as profile_router
from app.api.admin import router as admin_router

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Beginner-friendly Supermarket E-commerce backend using FastAPI and Supabase"
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under /api
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(categories_router, prefix=settings.API_V1_STR)
app.include_router(products_router, prefix=settings.API_V1_STR)
app.include_router(orders_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    """Root landing endpoint for the API."""
    return {
        "message": "Welcome to FreshCart Supermarket API!",
        "health_check": f"{settings.API_V1_STR}/health",
        "docs": "/docs",
        "endpoints": [
            f"{settings.API_V1_STR}/categories",
            f"{settings.API_V1_STR}/products",
            f"{settings.API_V1_STR}/orders",
            f"{settings.API_V1_STR}/profile",
            f"{settings.API_V1_STR}/admin/stats"
        ]
    }
