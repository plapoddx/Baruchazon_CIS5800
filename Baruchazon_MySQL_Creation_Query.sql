CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(300),
  phone_number VARCHAR(15),
  address TEXT,
  city VARCHAR(100),
  zipcode VARCHAR(20),
  payment_method VARCHAR(50),
  card_number VARCHAR(50),
  expiry_date VARCHAR(10),
  cvv VARCHAR(10),
  delivery_date DATE,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2),
    category varchar(255),
    rating decimal (10,2),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  product_name VARCHAR(255),
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

ALTER TABLE orders 
  ADD COLUMN shipping_method VARCHAR(50),
  ADD COLUMN shipping_cost DECIMAL(10,2),
  ADD COLUMN tax DECIMAL(10,2),
  ADD COLUMN total DECIMAL(10,2);