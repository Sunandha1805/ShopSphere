SELECT product_id, product_name, stock_quantity
FROM products
WHERE product_id = 1;

-- COMMIT 

START TRANSACTION;

UPDATE products
SET stock_quantity = stock_quantity + 10
WHERE product_id = 1;

SELECT product_id, product_name, stock_quantity
FROM products
WHERE product_id = 1;

COMMIT; -- once committed you cannnot rollback

-- ROLLBACK

START TRANSACTION;

UPDATE products
SET stock_quantity = stock_quantity + 100
WHERE product_id = 1;

SELECT product_id, product_name, stock_quantity
FROM products
WHERE product_id = 1;

ROLLBACK;


-- ***************************************
START TRANSACTION;

-- 1. Create an order
INSERT INTO orders (
    user_id,
    address_id,
    order_date,
    order_status,
    payment_status,
    total_amount
)
VALUES (
    1,
    1,
    NOW(),
    'Pending',
    'Pending',
    999.00
);

-- Store the generated order ID
SET @new_order_id = LAST_INSERT_ID();

-- 2. Add product to the order
-- Your stock triggers will run automatically here
INSERT INTO order_items (
    order_id,
    product_id,
    quantity,
    price,
    subtotal
)
VALUES (
    @new_order_id,
    1,
    2,
    499.50,
    999.00
);

-- 3. Create payment record
INSERT INTO payments (
    order_id,
    payment_method,
    transaction_id,
    amount,
    payment_status,
    payment_date
)
VALUES (
    @new_order_id,
    'UPI',
    CONCAT('TXN', @new_order_id),
    999.00,
    'Success',
    NOW()
);

COMMIT;
