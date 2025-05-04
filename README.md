# Baruchazon - Online E-Commerce Platform

Welcome to **Baruchazon** — a full-featured e-commerce platform for online shopping, with customer checkout, cart management, product management (admin panel), and order management functionality!

## Features

- Customer Side
  - Browse all products
  - View detailed product pages
  - Add products to cart (Quick Add)
  - Manage cart (add/remove items, quantity adjustment, view cart total)
  - Guest Checkout with tax and shipping cost calculations
  - Order Confirmation with delivery estimate and order summary
  - Ability to Cancel an order after purchase from confirmation page
  - View past orders with Lookup by confirmation number and email

- Admin Panel
  - Dashboard to view all customer orders with full item breakdown
  - Update order status (Pending, Shipped, Delivered, Cancelled)
  - CRUD operations: Create, Read, Update, Delete - for Product Management
  - Product pagination and search functionality
  - Local Admin Authentication
  - 
- Backend & Database
  - MySQL database to store orders, items, and products
  - RESTful API with endpoints for orders, items, admin tools
  - Order tracking with status history

## Technologies Used

- Frontend
  - HTML5, CSS3
  - Bootstrap 4.3
  - Vanilla JavaScript

- Backend
  - Node.js
  - Express.js
  - MySQL2

- Database
  - MySQL

- Others
  - LocalStorage for cart and order persistence
  - REST API integration
  - GitHub + Vercel deployment (frontend only)

```

## Installation Instructions

1. Clone the repository

```bash
git clone https://github.com/your-username/baruchazon.git
cd baruchazon
```

2. Install backend dependencies

```bash
npm install express mysql2 cors
```

3. Set up MySQL Database (Optional as Source Code hardcoded into server.js, and can query from there)

- Create a database `baruchazon`
- Import the schema and data for:
  - `products` using 'inventory.csv' on DBeaver or MySQL Workbench
- Adjust your `server.js` database credentials

4. Run the server

```bash
node server.js
```

The server will run at `https://api-baruchazon-server.onrender.com/`. or localhost:3000 if you run the 'server.js' locally 

5. Open Frontend

- PLEASE Use Live Server in VS Code or deploy using Vercel (static frontend)

## API Endpoints

- `GET /api/products` — Fetch all products
- `GET /api/products/:id` — Fetch specific product
- `POST /api/orders` — Create a new order
- `GET /api/orders-with-items` — View all orders with item details (admin)
- `PUT /api/orders/:id/status` — Update order status
- `DELETE /api/orders/:id` — Delete/cancel order
- `POST /api/orders/lookup` — Guest order lookup

## Future Enhancements

- Featured products and categories
- Admin dashboard with analytics
- Product image upload tool
- User authentication (customer login)
- Email notifications (order receipts, updates)
- Stripe or PayPal integration

## Developed By

Baruchazon Team  
