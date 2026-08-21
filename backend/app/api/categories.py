from fastapi import APIRouter
from app.core.supabase import db

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", summary="Get all supermarket categories")
async def get_categories():
    """
    Returns the list of available grocery categories (Fruits, Vegetables, Dairy, etc.).
    """
    categories = await db.get_categories()
    return {"categories": categories}
