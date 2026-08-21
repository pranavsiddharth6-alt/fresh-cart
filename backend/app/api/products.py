from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, Depends, Query, status
from app.core.supabase import db
from app.core.auth import require_admin

router = APIRouter(prefix="/products", tags=["Products"])

class ProductCreateSchema(BaseModel):
    name: str = Field(..., example="Organic Fresh Bananas")
    category_id: str = Field(..., example="fruits")
    description: Optional[str] = Field("", example="Sweet organic bananas")
    price: float = Field(..., gt=0, example=1.99)
    unit: Optional[str] = Field("1 item", example="1 kg")
    image_url: str = Field(..., example="https://images.unsplash.com/...")
    stock: int = Field(50, ge=0, example=50)
    is_featured: Optional[bool] = False

class ProductUpdateSchema(BaseModel):
    name: Optional[str] = None
    category_id: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    unit: Optional[str] = None
    image_url: Optional[str] = None
    stock: Optional[int] = Field(None, ge=0)
    is_featured: Optional[bool] = None

@router.get("", summary="Get products with category, search and sort filters")
async def list_products(
    category: Optional[str] = Query(None, description="Category id or 'all'"),
    search: Optional[str] = Query(None, description="Search keyword"),
    sort_by: Optional[str] = Query(None, description="'price_asc', 'price_desc', or 'newest'")
):
    """
    Returns products list filtered by category, search query, or sorting.
    """
    products = await db.get_products(category=category, search=search, sort_by=sort_by)
    return {"products": products, "count": len(products)}

@router.get("/{product_id}", summary="Get product details by ID")
async def get_product(product_id: str):
    """
    Returns single product details by product ID.
    """
    product = await db.get_product_by_id(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Product not found"
        )
    return product

@router.post("", summary="Add new product (Admin)")
async def create_product(
    payload: ProductCreateSchema, 
    admin_user: Dict[str, Any] = Depends(require_admin)
):
    """
    Admin endpoint to add a new supermarket product.
    """
    created = await db.create_product(payload.model_dump())
    return {"message": "Product created successfully", "product": created}

@router.put("/{product_id}", summary="Update product details/stock/price (Admin)")
async def update_product(
    product_id: str, 
    payload: ProductUpdateSchema, 
    admin_user: Dict[str, Any] = Depends(require_admin)
):
    """
    Admin endpoint to update product info, price, or inventory stock.
    """
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    updated = await db.update_product(product_id, updates)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Product not found"
        )
    return {"message": "Product updated successfully", "product": updated}

@router.delete("/{product_id}", summary="Delete product (Admin)")
async def delete_product(
    product_id: str, 
    admin_user: Dict[str, Any] = Depends(require_admin)
):
    """
    Admin endpoint to delete a product from the catalog.
    """
    success = await db.delete_product(product_id)
    return {"message": "Product deleted successfully", "success": success}
