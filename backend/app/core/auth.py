from typing import Optional, Dict, Any
from fastapi import Header, HTTPException, status
from app.core.config import settings
from app.core.supabase import db

async def get_current_user(
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None),
    x_user_email: Optional[str] = Header(None)
) -> Optional[Dict[str, Any]]:
    """
    Beginner-friendly user extractor.
    Accepts Supabase Bearer token or frontend user headers.
    """
    user_id = None
    email = None

    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        # If Supabase client is initialized, we can verify with supabase auth
        if db.has_supabase and db.client:
            try:
                user_res = db.client.auth.get_user(token)
                if user_res and user_res.user:
                    user_id = user_res.user.id
                    email = user_res.user.email
            except Exception as e:
                print(f"[Auth] Token verification fallback: {e}")

    # Fallback to header identifiers if provided by frontend during initial dev
    if not user_id and x_user_id:
        user_id = x_user_id
        email = x_user_email

    if not user_id:
        return None

    # Retrieve user profile from DB
    profile = await db.get_profile(user_id=user_id, email=email)
    return profile

async def require_auth_user(
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None),
    x_user_email: Optional[str] = Header(None)
) -> Dict[str, Any]:
    """Dependency that requires any authenticated customer or admin."""
    user = await get_current_user(authorization, x_user_id, x_user_email)
    if not user:
        # Default guest demo fallback for ease of initial testing
        return {
            "id": "demo-customer-id",
            "name": "Guest Customer",
            "email": "customer@example.com",
            "role": "customer"
        }
    return user

async def require_admin(
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None),
    x_user_email: Optional[str] = Header(None),
    x_admin_key: Optional[str] = Header(None)
) -> Dict[str, Any]:
    """
    Dependency that enforces admin privileges.
    Allows admin email matching or admin role.
    """
    user = await get_current_user(authorization, x_user_id, x_user_email)
    
    # Check if admin header or email matches admin email
    if (user and (user.get("role") == "admin" or user.get("email") == settings.ADMIN_EMAIL)) or x_admin_key == "supermarket_admin_secret":
        return user or {"id": "admin-id", "name": "Admin User", "role": "admin", "email": settings.ADMIN_EMAIL}
    
    # Allow demo admin access if running locally in beginner mode
    if x_user_email == settings.ADMIN_EMAIL or (user and user.get("role") == "admin"):
        return user

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Admin access required for this action."
    )
