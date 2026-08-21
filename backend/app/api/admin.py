from typing import Dict, Any
from fastapi import APIRouter, Depends
from app.core.supabase import db
from app.core.auth import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/stats", summary="Get dashboard summary metrics (Admin)")
async def get_admin_dashboard_stats(
    admin_user: Dict[str, Any] = Depends(require_admin)
):
    """
    Returns store overview statistics: Total Products, Total Orders, Total Revenue, Low Stock Alerts.
    """
    stats = await db.get_admin_stats()
    return stats
