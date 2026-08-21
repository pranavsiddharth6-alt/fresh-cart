from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, Depends, Query, status
from app.core.supabase import db
from app.core.auth import get_current_user, require_admin

router = APIRouter(prefix="/orders", tags=["Orders"])

class OrderItemSchema(BaseModel):
    product_id: Optional[str] = None
    product_name: str
    quantity: int = Field(..., gt=0)
    price: float = Field(..., ge=0)
    subtotal: Optional[float] = None

class CreateOrderSchema(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    delivery_address: str
    total_amount: float = Field(..., gt=0)
    delivery_fee: Optional[float] = 0.0
    payment_method: Optional[str] = "Cash on Delivery"
    items: List[OrderItemSchema]
    user_id: Optional[str] = None

class UpdateOrderStatusSchema(BaseModel):
    status: str = Field(..., example="Delivered")

@router.post("", summary="Place a new order (Cash on Delivery)")
async def create_order(
    payload: CreateOrderSchema,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    """
    Creates a new customer grocery order and stores order items.
    """
    order_dict = payload.model_dump()
    # Associate logged-in user if available
    if current_user and not order_dict.get("user_id"):
        order_dict["user_id"] = current_user.get("id")

    created_order = await db.create_order(order_dict)
    return {
        "message": "Order placed successfully!",
        "order": created_order
    }

@router.get("", summary="Get orders (filtered by user or all for admin)")
async def get_orders(
    user_id: Optional[str] = Query(None),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    """
    Retrieve orders. If admin, returns all orders. Otherwise returns user-specific orders.
    """
    # If user is admin or requested all without user_id limit
    effective_user_id = user_id
    if current_user:
        if current_user.get("role") != "admin":
            effective_user_id = current_user.get("id")
    
    orders = await db.get_orders(user_id=effective_user_id)
    return {"orders": orders, "count": len(orders)}

@router.get("/{order_id}", summary="Get order by ID")
async def get_order(order_id: str):
    """
    Fetch a single order's details including items.
    """
    order = await db.get_order_by_id(order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Order not found"
        )
    return order

@router.put("/{order_id}/status", summary="Update order status (Admin)")
async def update_order_status(
    order_id: str,
    payload: UpdateOrderStatusSchema,
    admin_user: Dict[str, Any] = Depends(require_admin)
):
    """
    Admin endpoint to update order status (Pending, Processing, Out for Delivery, Delivered, Cancelled).
    """
    updated_order = await db.update_order_status(order_id, payload.status)
    if not updated_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Order not found"
        )
    return {
        "message": f"Order status updated to {payload.status}", 
        "order": updated_order
    }
