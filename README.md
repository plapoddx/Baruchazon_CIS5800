# Baruchazon - Online E-Commerce Platform

Welcome to **Baruchazon** — a full-featured e-commerce platform for online shopping, with customer checkout, cart management, product management (admin panel), and order management functionality!

## Features

- Customer Side
  - Browse all products with pagination
  - View detailed product pages
  - Search, filter, and sort products by name, category, price, and rating
  - Add products to cart (Quick Add)
  - Manage cart (remove items, view cart total)
  - Guest Checkout
  - Order Confirmation with order summary
  - Ability to Cancel an order after purchase
  - View past orders with Lookup by confirmation number and email

- Admin Panel
  - Dashboard to view all customer orders
  - Update order status (Pending, Shipped, Delivered)
  - Delete/cancel orders
  - Manage Products (CRUD operations: Create, Read, Update, Delete)
  - Product pagination and management
  - Upload featured products (coming soon)

- Database
  - MySQL database for orders, order items, products
  - RESTful API built using Node.js and Express.js

- Frontend
  - Responsive design using Bootstrap 4.3
  - Carousel hero section
  - Interactive navigation bar
  - Parallax effects for modern look

## Technologies Used

- Frontend
  - HTML5, CSS3
  - Bootstrap 4
  - JavaScript (Vanilla)

- Backend
  - Node.js
  - Express.js
  - MySQL2

- Database
  - MySQL Server

- Others
  - LocalStorage (Cart and Order Persistence)
  - REST API integration
  
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

3. Optional! Set up MySQL Database
- (If you want. I ported my own SQL Server)
- Create a database `baruchazon`
- Import the tables for:
  - `products`
  - `orders`
  - `order_items`
- Adjust your `server.js` database credentials if necessary
- I added a file for all the SQL Query I used to create the table. 

4. Run the server

```bash
node server.js
```

The server should be running at `http://localhost:3000/`.

5. Open Frontend

Use Live Server. VS Code Live Server Could be used

## API Endpoints

- `GET /api/products` — Fetch all products
- `GET /api/products/:id` — Fetch a specific product
- `POST /api/orders` — Create a new order
- `GET /api/orders-with-items` — Fetch all orders with their items
- `PUT /api/orders/:id/status` — Update order status
- `DELETE /api/orders/:id` — Delete (cancel) an order
- `POST /api/orders/lookup` — Lookup an order using confirmation number and email

## Future Enhancements

- Featured product selection
- Admin dashboard analytics (total sales, revenue)
- Product image upload
- User authentication and customer accounts
- Real payment integration (Stripe or PayPal)

## Developed By

Baruchazon Team  
2025 Project

## Screenshots
