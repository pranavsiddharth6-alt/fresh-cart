-- =========================================================================
-- SUPERMARKET E-COMMERCE DATABASE SCHEMA (SUPABASE POSTGRESQL - INR / ₹)
-- Run this SQL in your Supabase SQL Editor to set up tables and initial data
-- =========================================================================

-- 1. Profiles Table (Stores user profile details linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT DEFAULT '',
    role TEXT DEFAULT 'customer', -- 'customer' or 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT DEFAULT 'ShoppingBag'
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    unit TEXT DEFAULT '1 item',
    image_url TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 50 CHECK (stock >= 0),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
    payment_method TEXT DEFAULT 'Cash on Delivery',
    status TEXT DEFAULT 'Pending', -- 'Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL
);

-- 6. Addresses Table (Saved Customer Addresses)
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    phone TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for Catalog
CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow insert and update on products" ON public.products FOR ALL USING (true);

-- User Policies for Profiles
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User Policies for Orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE public.orders.id = public.order_items.order_id AND public.orders.user_id = auth.uid())
);

-- Initial Category Seeds
INSERT INTO public.categories (id, name, slug, icon) VALUES
('fruits', 'Fruits', 'fruits', 'Apple'),
('vegetables', 'Vegetables', 'vegetables', 'Carrot'),
('dairy', 'Dairy & Eggs', 'dairy', 'Milk'),
('groceries', 'Pantry & Groceries', 'groceries', 'Wheat'),
('beverages', 'Beverages', 'beverages', 'Coffee'),
('snacks', 'Snacks & Bakery', 'snacks', 'Cookie')
ON CONFLICT (id) DO NOTHING;

-- Initial Products Seed (in Indian Rupees - INR / ₹)
INSERT INTO public.products (category_id, name, description, price, unit, image_url, stock, is_featured) VALUES
('fruits', 'Organic Fresh Bananas', 'Sweet, potassium-rich ripe organic Cavendish bananas.', 60, '1 bunch (approx 1kg)', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80', 80, true),
('fruits', 'Crisp Red Gala Apples', 'Juicy, sweet, and crisp farm-fresh orchard apples.', 160, '1 kg', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 65, true),
('fruits', 'Fresh Valencia Oranges', 'High in vitamin C, perfect for fresh morning juice.', 120, '1.5 kg bag', 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80', 40, false),
('vegetables', 'Fresh Farm Tomatoes', 'Plump vine-ripened red tomatoes for salads and cooking.', 40, '1 kg', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80', 90, true),
('vegetables', 'Organic Baby Spinach', 'Tender washed green baby spinach leaves, rich in iron.', 30, '250g pack', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80', 50, false),
('vegetables', 'Fresh Crunchy Carrots', 'Locally grown crisp carrots, sweet and vibrant.', 50, '1 kg bag', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80', 70, false),
('dairy', 'Farm Whole Milk', 'Pasteurized fresh whole milk with rich cream and calcium.', 65, '1 Liter Pouch', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80', 45, true),
('dairy', 'Free-Range Brown Eggs', 'Grade-A large pasture-raised brown farm fresh eggs.', 90, '6 pcs carton', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80', 60, true),
('dairy', 'Pure Salted Butter', 'Traditional churned golden cream butter with a touch of salt.', 120, '200g pack', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80', 35, false),
('groceries', 'Artisan Sourdough Bread', 'Naturally leavened fresh baked rustic sourdough loaf.', 85, '1 loaf (400g)', 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80', 25, true),
('groceries', 'Organic Basmati Rice', 'Fragrant long-grain aged premium royal basmati rice.', 190, '1 kg bag', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', 40, false),
('groceries', 'Extra Virgin Olive Oil', 'Cold-pressed 100% pure Mediterranean extra virgin olive oil.', 450, '500ml bottle', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80', 30, false),
('beverages', '100% Pure Orange Juice', 'Cold-pressed freshly squeezed orange juice with pulp.', 110, '1 Liter bottle', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80', 40, true),
('beverages', 'Roast Arabica Coffee Beans', 'Medium-dark roast whole bean specialty single-origin coffee.', 350, '250g bag', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80', 30, false),
('snacks', 'Handmade Chocolate Cookies', 'Chunky dark and milk chocolate chip bakery cookies.', 75, '6 pack (200g)', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80', 50, true),
('snacks', 'Roasted Salted Almonds', 'Crunchy oven-roasted premium California almonds.', 220, '200g pouch', 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80', 45, false)
ON CONFLICT DO NOTHING;
