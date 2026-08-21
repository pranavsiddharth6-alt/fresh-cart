from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify backend status.
    Returns API status, version, and server timestamp.
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
