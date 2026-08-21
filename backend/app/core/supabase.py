import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.data.initial_data import INITIAL_CATEGORIES, INITIAL_PRODUCTS

# In-memory database store (acts as a mock/local fallback store for zero-friction local development)
_memory_categories = list(INITIAL_CATEGORIES)
_memory_products = list(INITIAL_PRODUCTS)
_memory_orders: List[Dict[str, Any]] = []
_memory_order_items: List[Dict[str, Any]] = []
_memory_profiles: Dict[str, Dict[str, Any]] = {
    "demo-user-id": {
        "id": "demo-user-id",
        "name": "Alex Johnson",
        "email": "customer@example.com",
        "phone": "+1 (555) 234-5678",
        "role": "customer",
        "created_at": "2026-08-20T12:00:00Z"
    },
    "admin-user-id": {
        "id": "admin-user-id",
        "name": "Supermarket Store Admin",
        "email": settings.ADMIN_EMAIL,
        "phone": "+1 (555) 999-0000",
        "role": "admin",
        "created_at": "2026-08-20T12:00:00Z"
    }
}

class SupabaseService:
    """
    Database service layer handling Supabase PostgreSQL or local fallback.
    """
    def __init__(self):
        self.has_supabase = bool(settings.SUPABASE_URL and settings.SUPABASE_KEY and "your-project" not in settings.SUPABASE_URL)
        self.client = None
        if self.has_supabase:
            try:
                from supabase import create_client, Client
                self.client: Optional[Client] = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            except Exception as e:
                print(f"[SupabaseService] Error initializing Supabase client: {e}. Falling back to local storage.")
                self.has_supabase = False

    # --- CATEGORIES ---
    async def get_categories(self) -> List[Dict[str, Any]]:
        if self.has_supabase and self.client:
            try:
                response = self.client.table("categories").select("*").execute()
                if response.data:
                    return response.data
            except Exception as e:
                print(f"[Supabase] Categories query error: {e}")
        return _memory_categories

    # --- PRODUCTS ---
    async def get_products(
        self, 
        category: Optional[str] = None, 
        search: Optional[str] = None, 
        sort_by: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        if self.has_supabase and self.client:
            try:
                query = self.client.table("products").select("*")
                if category and category != "all":
                    query = query.eq("category_id", category)
                if search:
                    query = query.ilike("name", f"%{search}%")
                if sort_by == "price_asc":
                    query = query.order("price", desc=False)
                elif sort_by == "price_desc":
                    query = query.order("price", desc=True)
                else:
                    query = query.order("created_at", desc=True)
                response = query.execute()
                if response.data is not None:
                    return response.data
            except Exception as e:
                print(f"[Supabase] Products query error: {e}")

        # Local fallback filter logic
        results = list(_memory_products)
        if category and category != "all":
            results = [p for p in results if p.get("category_id") == category]
        if search:
            query_lower = search.lower()
            results = [
                p for p in results 
                if query_lower in p.get("name", "").lower() or query_lower in p.get("description", "").lower()
            ]
        if sort_by == "price_asc":
            results.sort(key=lambda x: float(x.get("price", 0)))
        elif sort_by == "price_desc":
            results.sort(key=lambda x: float(x.get("price", 0)), reverse=True)
        return results

    async def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        if self.has_supabase and self.client:
            try:
                response = self.client.table("products").select("*").eq("id", product_id).single().execute()
                if response.data:
                    return response.data
            except Exception as e:
                print(f"[Supabase] Product by id error: {e}")

        for p in _memory_products:
            if str(p.get("id")) == str(product_id):
                return p
        return None

    async def create_product(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        new_id = str(uuid.uuid4())
        record = {
            "id": new_id,
            "name": product_data["name"],
            "category_id": product_data.get("category_id", "groceries"),
            "description": product_data.get("description", ""),
            "price": float(product_data["price"]),
            "unit": product_data.get("unit", "1 item"),
            "image_url": product_data.get("image_url", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"),
            "stock": int(product_data.get("stock", 20)),
            "is_featured": bool(product_data.get("is_featured", False)),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        if self.has_supabase and self.client:
            try:
                res = self.client.table("products").insert(record).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[Supabase] Create product error: {e}")

        _memory_products.insert(0, record)
        return record

    async def update_product(self, product_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.has_supabase and self.client:
            try:
                res = self.client.table("products").update(updates).eq("id", product_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[Supabase] Update product error: {e}")

        for i, p in enumerate(_memory_products):
            if str(p.get("id")) == str(product_id):
                _memory_products[i].update(updates)
                return _memory_products[i]
        return None

    async def delete_product(self, product_id: str) -> bool:
        if self.has_supabase and self.client:
            try:
                self.client.table("products").delete().eq("id", product_id).execute()
                return True
            except Exception as e:
                print(f"[Supabase] Delete product error: {e}")

        global _memory_products
        _memory_products = [p for p in _memory_products if str(p.get("id")) != str(product_id)]
        return True

    # --- ORDERS ---
    async def create_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        order_id = str(uuid.uuid4())
        now_str = datetime.now(timezone.utc).isoformat()
        
        order_record = {
            "id": order_id,
            "user_id": order_data.get("user_id"),
            "customer_name": order_data["customer_name"],
            "customer_email": order_data["customer_email"],
            "customer_phone": order_data["customer_phone"],
            "delivery_address": order_data["delivery_address"],
            "total_amount": float(order_data["total_amount"]),
            "delivery_fee": float(order_data.get("delivery_fee", 0.0)),
            "payment_method": order_data.get("payment_method", "Cash on Delivery"),
            "status": "Pending",
            "created_at": now_str
        }

        items_records = []
        for item in order_data.get("items", []):
            item_record = {
                "id": str(uuid.uuid4()),
                "order_id": order_id,
                "product_id": item.get("product_id"),
                "product_name": item.get("product_name") or item.get("name"),
                "quantity": int(item.get("quantity", 1)),
                "price": float(item.get("price", 0.0)),
                "subtotal": float(item.get("subtotal") or (float(item.get("price", 0.0)) * int(item.get("quantity", 1))))
            }
            items_records.append(item_record)

        if self.has_supabase and self.client:
            try:
                res_order = self.client.table("orders").insert(order_record).execute()
                if items_records:
                    self.client.table("order_items").insert(items_records).execute()
                order_record["items"] = items_records
                return order_record
            except Exception as e:
                print(f"[Supabase] Create order error: {e}")

        # Local fallback store
        order_record["items"] = items_records
        _memory_orders.insert(0, order_record)
        _memory_order_items.extend(items_records)
        return order_record

    async def get_orders(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if self.has_supabase and self.client:
            try:
                query = self.client.table("orders").select("*, order_items(*)").order("created_at", desc=True)
                if user_id:
                    query = query.eq("user_id", user_id)
                res = query.execute()
                if res.data is not None:
                    # Rename nested order_items for frontend consistency
                    for order in res.data:
                        order["items"] = order.get("order_items", [])
                    return res.data
            except Exception as e:
                print(f"[Supabase] Get orders error: {e}")

        # Local fallback
        results = []
        for o in _memory_orders:
            if user_id is None or o.get("user_id") == user_id:
                o_copy = dict(o)
                o_copy["items"] = [item for item in _memory_order_items if item.get("order_id") == o["id"]]
                results.append(o_copy)
        return results

    async def get_order_by_id(self, order_id: str) -> Optional[Dict[str, Any]]:
        if self.has_supabase and self.client:
            try:
                res = self.client.table("orders").select("*, order_items(*)").eq("id", order_id).single().execute()
                if res.data:
                    res.data["items"] = res.data.get("order_items", [])
                    return res.data
            except Exception as e:
                print(f"[Supabase] Get order by id error: {e}")

        for o in _memory_orders:
            if str(o["id"]) == str(order_id):
                o_copy = dict(o)
                o_copy["items"] = [item for item in _memory_order_items if item.get("order_id") == o["id"]]
                return o_copy
        return None

    async def update_order_status(self, order_id: str, status: str) -> Optional[Dict[str, Any]]:
        if self.has_supabase and self.client:
            try:
                res = self.client.table("orders").update({"status": status}).eq("id", order_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[Supabase] Update order status error: {e}")

        for o in _memory_orders:
            if str(o["id"]) == str(order_id):
                o["status"] = status
                return o
        return None

    # --- PROFILE ---
    async def get_profile(self, user_id: str, email: Optional[str] = None) -> Dict[str, Any]:
        if self.has_supabase and self.client:
            try:
                res = self.client.table("profiles").select("*").eq("id", user_id).single().execute()
                if res.data:
                    return res.data
            except Exception as e:
                print(f"[Supabase] Get profile error: {e}")

        if user_id in _memory_profiles:
            return _memory_profiles[user_id]
        
        # Create default profile
        role = "admin" if email and email == settings.ADMIN_EMAIL else "customer"
        default_profile = {
            "id": user_id,
            "name": email.split("@")[0].capitalize() if email else "Supermarket Shopper",
            "email": email or "user@example.com",
            "phone": "",
            "role": role,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        _memory_profiles[user_id] = default_profile
        return default_profile

    async def update_profile(self, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        if self.has_supabase and self.client:
            try:
                res = self.client.table("profiles").upsert({**updates, "id": user_id}).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[Supabase] Update profile error: {e}")

        current = await self.get_profile(user_id)
        current.update(updates)
        _memory_profiles[user_id] = current
        return current

    # --- ADMIN STATS ---
    async def get_admin_stats(self) -> Dict[str, Any]:
        products = await self.get_products()
        orders = await self.get_orders()
        total_revenue = sum(float(o.get("total_amount", 0.0)) for o in orders)
        low_stock_count = sum(1 for p in products if int(p.get("stock", 0)) <= 10)
        
        return {
            "total_products": len(products),
            "total_orders": len(orders),
            "total_revenue": round(total_revenue, 2),
            "low_stock_count": low_stock_count
        }

db = SupabaseService()
