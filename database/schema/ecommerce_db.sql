create database ecommerce_db;
use ecommerce_db;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE,
    gender ENUM('Male','Female','Other'),
    date_of_birth DATE,
    account_status ENUM('Active','Inactive','Blocked') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    description TEXT,
    sku VARCHAR(50) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    stock_quantity INT NOT NULL,
    image_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(category_id)
        REFERENCES categories(category_id)
);

CREATE TABLE addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_type ENUM('Home','Office','Other') DEFAULT 'Home',
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,

    FOREIGN KEY(user_id)
        REFERENCES users(user_id)
);

CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES users(user_id)
);

CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,

    FOREIGN KEY(cart_id)
        REFERENCES cart(cart_id),

    FOREIGN KEY(product_id)
        REFERENCES products(product_id)
);

alter table cart_items
add column added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE wishlist (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES users(user_id)
);

CREATE TABLE wishlist_items (
    wishlist_item_id INT AUTO_INCREMENT PRIMARY KEY,
    wishlist_id INT NOT NULL,
    product_id INT NOT NULL,

    FOREIGN KEY(wishlist_id)
        REFERENCES wishlist(wishlist_id),

    FOREIGN KEY(product_id)
        REFERENCES products(product_id)
);

alter table wishlist_items
add column added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_id INT NOT NULL,

    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    order_status ENUM(
        'Pending',
        'Confirmed',
        'Packed',
        'Shipped',
        'Delivered',
        'Cancelled',
        'Returned'
    ) DEFAULT 'Pending',

    payment_status ENUM(
        'Pending',
        'Paid',
        'Refunded'
    ) DEFAULT 'Pending',

    total_amount DECIMAL(10,2) NOT NULL,

    delivery_date DATE,

    FOREIGN KEY(user_id)
        REFERENCES users(user_id),

    FOREIGN KEY(address_id)
        REFERENCES addresses(address_id)
);

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,

    quantity INT NOT NULL,

    price DECIMAL(10,2) NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    FOREIGN KEY(order_id)
        REFERENCES orders(order_id),

    FOREIGN KEY(product_id)
        REFERENCES products(product_id)
);

CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT UNIQUE NOT NULL,

    payment_method ENUM(
        'UPI',
        'Credit Card',
        'Debit Card',
        'Net Banking',
        'Cash On Delivery',
        'Wallet'
    ),

    transaction_id VARCHAR(100) UNIQUE,

    amount DECIMAL(10,2),

    payment_status ENUM(
        'Success',
        'Failed',
        'Pending',
        'Refunded'
    ),

    payment_date DATETIME,

    FOREIGN KEY(order_id)
        REFERENCES orders(order_id)
);

CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    product_id INT NOT NULL,

    rating INT CHECK(rating BETWEEN 1 AND 5),

    review_text TEXT,

    review_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES users(user_id),

    FOREIGN KEY(product_id)
        REFERENCES products(product_id)
);

CREATE INDEX idx_products_category
ON products(category_id);

CREATE INDEX idx_orders_user
ON orders(user_id);

CREATE INDEX idx_orders_date
ON orders(order_date);

CREATE INDEX idx_order_items_order
ON order_items(order_id);

CREATE INDEX idx_order_items_product
ON order_items(product_id);

CREATE INDEX idx_reviews_product
ON reviews(product_id);

CREATE INDEX idx_reviews_user
ON reviews(user_id);

CREATE INDEX idx_addresses_user
ON addresses(user_id);

CREATE INDEX idx_cart_items_cart
ON cart_items(cart_id);

CREATE INDEX idx_cart_items_product
ON cart_items(product_id);

CREATE INDEX idx_wishlist_items_wishlist
ON wishlist_items(wishlist_id);

CREATE INDEX idx_wishlist_items_product
ON wishlist_items(product_id);

