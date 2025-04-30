const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createPool({
  host: 'plapodd.eithel.org', // Replace with your database host
  user: 'root', // Replace with your database user
  password: 'IpNdVgqRe9PAM0NdHAkGRaInlCIc5eKP', // Replace with your database password
  database: 'baruchazon',
  port: 3306
});

// Fetch all products
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching products', error: err });
    res.json(results);
  });
});

// Fetch single product
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching product', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(results[0]);
  });
});

// Create new order with order items
app.post('/api/orders', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone_number,
    address,
    city,
    zipcode,
    paymentMethod,
    cardNumber,
    expiryDate,
    cvv,
    deliveryDate,
    cart
  } = req.body;

  const orderSql = `
    INSERT INTO orders 
    (first_name, last_name, email, phone_number, address, city, zipcode, payment_method, card_number, expiry_date, cvv, delivery_date, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const orderValues = [
    firstName, lastName, email, phone_number, address,
    city, zipcode, paymentMethod, cardNumber, expiryDate, cvv,
    deliveryDate, 'Pending'
  ];

  db.query(orderSql, orderValues, (err, result) => {
    if (err) {
      console.error('Order insert error:', err);
      return res.status(500).json({ message: 'Failed to save order' });
    }

    const orderId = result.insertId;

    if (cart && cart.length > 0) {
      const itemSql = `
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
        VALUES ?
      `;
      const itemValues = cart.map(item => [
        orderId,
        item.id,
        item.name,
        item.quantity || 1,
        parseFloat(item.price)
      ]);

      db.query(itemSql, [itemValues], (itemErr) => {
        if (itemErr) {
          console.error('Order items insert error:', itemErr);
          return res.status(500).json({ message: 'Order saved, but failed to save items' });
        }

        console.log(`✅ New order saved: BZ-${orderId} - ${firstName} ${lastName}`);
        res.status(200).json({ message: 'Order and items saved successfully', orderId });
      });
    } else {
      console.log(`✅ New order saved (no items): BZ-${orderId}`);
      res.status(200).json({ message: 'Order saved (no items)', orderId });
    }
  });
});

// Admin: Fetch orders with items
app.get('/api/orders-with-items', (req, res) => {
  const sql = `
    SELECT 
      o.id AS order_id,
      o.first_name,
      o.last_name,
      o.email,
      o.phone_number,
      o.address,
      o.city,
      o.zipcode,
      o.delivery_date,
      o.status,
      oi.product_name,
      oi.quantity,
      oi.price
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    ORDER BY o.id DESC, oi.id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ message: 'Failed to retrieve orders with items' });
    }

    const grouped = {};
    results.forEach(row => {
      const orderId = row.order_id;
      if (!grouped[orderId]) {
        grouped[orderId] = {
          order_id: orderId,
          name: `${row.first_name} ${row.last_name}`,
          email: row.email,
          phone: row.phone_number,
          address: `${row.address}, ${row.city}, ${row.zipcode}`,
          delivery_date: row.delivery_date,
          status: row.status,
          items: []
        };
      }

      if (row.product_name) {
        grouped[orderId].items.push({
          product_name: row.product_name,
          quantity: row.quantity,
          price: row.price
        });
      }
    });

    res.json(Object.values(grouped));
  });
});

// Delete order
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM order_items WHERE order_id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting order items:', err);
      return res.status(500).json({ message: 'Failed to delete order items' });
    }

    db.query('DELETE FROM orders WHERE id = ?', [id], (err2) => {
      if (err2) {
        console.error('Error deleting order:', err2);
        return res.status(500).json({ message: 'Failed to delete order' });
      }

      console.log(`🗑️ Order deleted: ID ${id}`);
      res.status(200).json({ message: 'Order deleted successfully' });
    });
  });
});

// Update order status
app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error('Update status error:', err);
      return res.status(500).json({ message: 'Failed to update status' });
    }
    console.log(`🔄 Order status updated: ID ${id} -> ${status}`);
    res.status(200).json({ message: 'Status updated successfully' });
  });
});

// Lookup Order
app.post('/api/orders/lookup', (req, res) => {
  const { confirmationNumber, email } = req.body;
  const orderId = confirmationNumber.replace('BZ-', '');

  const sql = `
    SELECT 
      o.id AS order_id,
      o.first_name,
      o.last_name,
      o.email,
      o.phone_number,
      o.address,
      o.city,
      o.zipcode,
      o.delivery_date,
      oi.product_name,
      oi.quantity,
      oi.price
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.id = ? AND o.email = ?
  `;

  db.query(sql, [orderId, email], (err, results) => {
    if (err) {
      console.error('Order lookup error:', err);
      return res.status(500).json({ message: 'Server error during lookup' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No matching order found' });
    }

    const orderInfo = {
      order_id: results[0].order_id,
      customer_name: `${results[0].first_name} ${results[0].last_name}`,
      email: results[0].email,
      phone: results[0].phone_number,
      address: `${results[0].address}, ${results[0].city}, ${results[0].zipcode}`,
      delivery_date: results[0].delivery_date,
      items: results.map(row => ({
        product_name: row.product_name,
        quantity: row.quantity,
        price: row.price
      }))
    };

    res.json(orderInfo);
  });
});

app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  db.query(sql, ['Cancelled', id], (err, result) => {
    if (err) {
      console.error('Cancel order error:', err);
      return res.status(500).json({ message: 'Failed to cancel order' });
    }
    res.status(200).json({ message: 'Order cancelled successfully' });
  });
});

// Create a new product
app.post('/api/products', (req, res) => {
  const { name, description, price, image_url, rating } = req.body;
  
  const sql = `
    INSERT INTO products (name, description, price, image_url, rating)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, description, price, image_url, rating], (err, result) => {
    if (err) {
      console.error('Create product error:', err);
      return res.status(500).json({ message: 'Failed to create product' });
    }
    res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
  });
});

// Update a product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, rating } = req.body;

  const sql = `
    UPDATE products 
    SET name = ?, description = ?, price = ?, image_url = ?, rating = ?
    WHERE id = ?
  `;

  db.query(sql, [name, description, price, image_url, rating, id], (err, result) => {
    if (err) {
      console.error('Update product error:', err);
      return res.status(500).json({ message: 'Failed to update product' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  });
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM products WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Delete product error:', err);
      return res.status(500).json({ message: 'Failed to delete product' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://baruchazon.vercel.app:${PORT}`);
});

