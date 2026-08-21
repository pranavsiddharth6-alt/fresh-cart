"""
Initial seed data for Categories and Products in Indian Rupees (INR / ₹).
Acts as fallback for local zero-config operation and template for Supabase seeds.
"""

INITIAL_CATEGORIES = [
    {"id": "fruits", "name": "Fruits", "slug": "fruits", "icon": "Apple"},
    {"id": "vegetables", "name": "Vegetables", "slug": "vegetables", "icon": "Carrot"},
    {"id": "dairy", "name": "Dairy & Eggs", "slug": "dairy", "icon": "Milk"},
    {"id": "groceries", "name": "Pantry & Groceries", "slug": "groceries", "icon": "Wheat"},
    {"id": "beverages", "name": "Beverages", "slug": "beverages", "icon": "Coffee"},
    {"id": "snacks", "name": "Snacks & Bakery", "slug": "snacks", "icon": "Cookie"},
]

INITIAL_PRODUCTS = [
    {
        "id": "11111111-1111-1111-1111-111111111101",
        "category_id": "fruits",
        "name": "Organic Fresh Bananas",
        "description": "Sweet, potassium-rich ripe organic Cavendish bananas grown sustainably.",
        "price": 60,
        "unit": "1 bunch (approx 1kg)",
        "image_url": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
        "stock": 80,
        "is_featured": True,
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "11111111-1111-1111-1111-111111111102",
        "category_id": "fruits",
        "name": "Crisp Red Gala Apples",
        "description": "Juicy, sweet, and crisp farm-fresh orchard apples for healthy snacking.",
        "price": 160,
        "unit": "1 kg",
        "image_url": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
        "stock": 65,
        "is_featured": True,
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "11111111-1111-1111-1111-111111111103",
        "category_id": "fruits",
        "name": "Fresh Valencia Oranges",
        "description": "High in vitamin C, sweet and juicy, perfect for fresh morning breakfast juice.",
        "price": 120,
        "unit": "1.5 kg bag",
        "image_url": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80",
        "stock": 40,
        "is_featured": False,
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "11111111-1111-1111-1111-111111111104",
        "category_id": "vegetables",
        "name": "Fresh Farm Tomatoes",
        "description": "Plump vine-ripened red tomatoes for fresh salads, pasta sauces, and stews.",
        "price": 40,
        "unit": "1 kg",
        "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
        "stock": 90,
        "is_featured": True,
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "11111111-1111-1111-1111-111111111105",
        "category_id": "vegetables",
        "name": "Organic Baby Spinach",
        "description": "Tender pre-washed green baby spinach leaves, rich in iron, antioxidants and vitamins.",
        "price": 30,
        "unit": "250g pack",
        "image_url": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80",
        "stock": 50,
        "is_featured": False,
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "11111111-1111-1111-1111-111111111106",
        "category_id": "vegetables",
        "name": "Fresh Crunchy Carrots",
        "description": "Locally harvested crisp orange carrots, naturally sweet and packed with beta-carotene.",
        "price": 50,
        "unit": "1 kg bag",
        "image_url": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80",
        "stock": 70,
        "is_featured": False,
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "11111111-1111-1111-1111-111111111107",
        "category_id": "dairy",
        "name": "Farm Whole Milk",
        "description": "Pasteurized fresh whole milk with rich natural creaminess and high calcium content.",
        "price": 65,
        "unit": "1 Liter Pouch",
        "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
        "stock": 45,
        "is_featured": True,
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "11111111-1111-1111-1111-111111111108",
        "category_id": "dairy",
        "name": "Free-Range Brown Eggs",
        "description": "Grade-A large pasture-raised brown eggs with rich golden yolks.",
        "price": 90,
        "unit": "6 pcs carton",
        "image_url": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80",
        "stock": 60,
        "is_featured": True,
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "11111111-1111-1111-1111-111111111109",
        "category_id": "dairy",
        "name": "Pure Salted Butter",
        "description": "Traditional churned golden dairy cream butter made with fresh cow milk.",
        "price": 120,
        "unit": "200g pack",
        "image_url": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80",
        "stock": 35,
        "is_featured": False,
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "11111111-1111-1111-1111-111111111110",
        "category_id": "groceries",
        "name": "Artisan Sourdough Bread",
        "description": "Naturally fermented stone-baked sourdough loaf with crisp crust and soft airy crumb.",
        "price": 85,
        "unit": "1 loaf (400g)",
        "image_url": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80",
        "stock": 25,
        "is_featured": True,
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "11111111-1111-1111-1111-111111111111",
        "category_id": "groceries",
        "name": "Organic Basmati Rice",
        "description": "Fragrant long-grain aged premium Himalayan basmati rice for fluffy aromatic dishes.",
        "price": 190,
        "unit": "1 kg bag",
        "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
        "stock": 40,
        "is_featured": False,
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "11111111-1111-1111-1111-111111111112",
        "category_id": "groceries",
        "name": "Extra Virgin Olive Oil",
        "description": "First cold-pressed single estate extra virgin olive oil for dressing and gourmet cooking.",
        "price": 450,
        "unit": "500ml bottle",
        "image_url": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
        "stock": 30,
        "is_featured": False,
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "11111111-1111-1111-1111-111111111113",
        "category_id": "beverages",
        "name": "100% Pure Orange Juice",
        "description": "Cold-pressed fresh orange juice with natural pulp and zero added sugar.",
        "price": 110,
        "unit": "1 Liter bottle",
        "image_url": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80",
        "stock": 40,
        "is_featured": True,
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "11111111-1111-1111-1111-111111111114",
        "category_id": "beverages",
        "name": "Roast Arabica Coffee Beans",
        "description": "Freshly roasted medium-dark whole bean artisan coffee with chocolate notes.",
        "price": 350,
        "unit": "250g bag",
        "image_url": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80",
        "stock": 30,
        "is_featured": False,
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "11111111-1111-1111-1111-111111111115",
        "category_id": "snacks",
        "name": "Handmade Chocolate Cookies",
        "description": "Rich artisanal bakery cookies loaded with Belgian dark and milk chocolate chunks.",
        "price": 75,
        "unit": "6 pack (200g)",
        "image_url": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80",
        "stock": 50,
        "is_featured": True,
        "created_at": "2026-08-20T10:00:00Z"
    },
    {
        "id": "11111111-1111-1111-1111-111111111116",
        "category_id": "snacks",
        "name": "Roasted Salted Almonds",
        "description": "Slow oven-roasted premium California almonds lightly seasoned with sea salt.",
        "price": 220,
        "unit": "200g pouch",
        "image_url": "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80",
        "stock": 45,
        "is_featured": False,
        "created_at": "2026-08-20T10:00:00Z"
    }
]
