# 🛒 FreshCart - Local Supermarket E-Commerce (Full-Stack)

A clean, modern, beginner-friendly full-stack local supermarket e-commerce web application built with **React**, **FastAPI (Python)**, and **Supabase (PostgreSQL & Auth)**.

---

## 🌟 Overview & Features

### 🛍️ Customer Experience
1. **Home Page (`/`)**: Welcoming supermarket hero banner, aisle category cards, daily featured picks, store trust badges, and promotional offer banner.
2. **Products Catalog (`/products`)**: Responsive grocery grid with live search, category filter pills (Fruits, Veggies, Dairy, Pantry, Beverages, Snacks), and price sorting.
3. **Product Details (`/products/:id`)**: High-res product photo, pack unit, real-time stock indicator, description, quantity selector, and Add to Cart.
4. **Shopping Basket (`/cart`)**: Real-time item list, quantity counters (+/-), single item removal, free delivery threshold indicator, and subtotal calculation.
5. **Fast Doorstep Checkout (`/checkout`)**: Local delivery address form and **Cash on Delivery (COD)** payment selection.
6. **My Orders (`/orders`)**: Customer order tracking with status badges (*Pending*, *Processing*, *Out for Delivery*, *Delivered*).
7. **Authentication (`/login` & `/signup`)**: Supabase Auth with Email/Password & Google Login + demo one-click test logins.
8. **Customer Profile (`/profile`)**: Name, phone, and delivery contact info management.

### 🛡️ Admin Management (`/admin`)
- **Store KPI Dashboard**: Total Products, Total Customer Orders, Total Revenue, and Low Stock Alerts.
- **Products Catalog CRUD**: Add new grocery items, edit pricing & units, update inventory stock, and delete items.
- **Order Fulfillment**: Review customer orders, delivery addresses, items purchased, and update order status (*Pending* → *Processing* → *Out for Delivery* → *Delivered*).

---

## 📁 Project Structure

```
d:/orginial ecommerec/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin.py          # /api/admin/stats
│   │   │   ├── categories.py     # /api/categories
│   │   │   ├── health.py         # /api/health
│   │   │   ├── orders.py         # /api/orders
│   │   │   ├── products.py       # /api/products
│   │   │   └── profile.py        # /api/profile
│   │   ├── core/
│   │   │   ├── auth.py           # Supabase auth verification
│   │   │   ├── config.py         # Settings & environment config
│   │   │   └── supabase.py       # Supabase client & fallback data store
│   │   ├── data/
│   │   │   └── initial_data.py   # Initial supermarket catalog
│   │   └── main.py               # FastAPI entrypoint & CORS middleware
│   ├── database/
│   │   └── schema.sql            # Ready-to-run PostgreSQL schema for Supabase
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Supabase Auth session & actions
│   │   │   └── CartContext.jsx   # Shopping cart state & local storage
│   │   ├── pages/
│   │   │   ├── AdminPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── ProductDetailsPage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── services/
│   │   │   ├── api.js            # FastAPI fetch client
│   │   │   └── supabase.js       # Supabase public client
│   │   ├── App.jsx               # React Router routes
│   │   ├── main.jsx
│   │   └── index.css             # Custom modern supermarket theme
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── .env
│
├── .gitignore
└── README.md
```

---

## 🚀 How to Run Locally

### 1. Start the FastAPI Backend
Open a terminal in the `backend/` directory:
```powershell
cd backend
py -m pip install -r requirements.txt
py -m uvicorn app.main:app --reload --port 8000
```
- API Health Check: `http://localhost:8000/api/health`
- Interactive API Docs (Swagger): `http://localhost:8000/docs`

### 2. Start the React Frontend
Open a second terminal in the `frontend/` directory:
```powershell
cd frontend
npm install
npm run dev
```
- Open browser at `http://localhost:5173`

---

 ID and Secret.
