DELIMITER //

CREATE PROCEDURE PlaceOrder(
    IN p_user_id INT,
    IN p_address_id INT,
    IN p_product_id INT,
    IN p_quantity INT,
    IN p_payment_method VARCHAR(50)
)
BEGIN

    DECLARE v_order_id INT;
    DECLARE v_price DECIMAL(10,2);
    DECLARE v_total_amount DECIMAL(10,2);

    -- If any SQL error occurs
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;

        SELECT
            'Order failed. Transaction rolled back.'
            AS message;
    END;

    -- Start transaction
    START TRANSACTION;

    -- Get current product price
    SELECT price
    INTO v_price
    FROM products
    WHERE product_id = p_product_id;

    -- Calculate total
    SET v_total_amount = v_price * p_quantity;

    -- Create order
    INSERT INTO orders (
        user_id,
        address_id,
        order_date,
        order_status,
        payment_status,
        total_amount,
        delivery_date
    )
    VALUES (
        p_user_id,
        p_address_id,
        NOW(),
        'Confirmed',
        'Success',
        v_total_amount,
        NULL
    );

    -- Get newly generated order ID
    SET v_order_id = LAST_INSERT_ID();

    -- Add order item
    INSERT INTO order_items (
        order_id,
        product_id,
        quantity,
        price,
        subtotal
    )
    VALUES (
        v_order_id,
        p_product_id,
        p_quantity,
        v_price,
        v_total_amount
    );

    /*
       Your triggers automatically:
       1. Check available stock
       2. Reduce stock
    */

    -- Create payment
    INSERT INTO payments (
        order_id,
        payment_method,
        transaction_id,
        amount,
        payment_status,
        payment_date
    )
    VALUES (
        v_order_id,
        p_payment_method,
        CONCAT(
            'TXN',
            v_order_id,
            UNIX_TIMESTAMP()
        ),
        v_total_amount,
        'Success',
        NOW()
    );

    -- Everything succeeded
    COMMIT;

    SELECT
        'Order placed successfully' AS message,
        v_order_id AS order_id,
        v_total_amount AS total_amount;

END //

DELIMITER ;

-- ****************
CALL PlaceOrder(
    8201,
    8201,
    3,
    5,
    'UPI'
);