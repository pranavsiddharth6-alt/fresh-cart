from typing import Optional, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends, Query, status
from app.core.supabase import db
from app.core.auth import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])

class ProfileUpdateSchema(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

@router.get("", summary="Get user profile")
async def get_profile(
    user_id: Optional[str] = Query(None),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    """
    Returns user profile details.
    """
    target_id = user_id or (current_user.get("id") if current_user else "demo-user-id")
    email = current_user.get("email") if current_user else None
    profile = await db.get_profile(user_id=target_id, email=email)
    return profile

@router.put("", summary="Update user profile")
async def update_profile(
    payload: ProfileUpdateSchema,
    user_id: Optional[str] = Query(None),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    """
    Update name and phone on user profile.
    """
    target_id = user_id or (current_user.get("id") if current_user else "demo-user-id")
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    updated = await db.update_profile(user_id=target_id, updates=updates)
    return {
        "message": "Profile updated successfully",
        "profile": updated
    }
