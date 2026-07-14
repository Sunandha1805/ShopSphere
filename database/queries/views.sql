CREATE OR REPLACE VIEW customer_order_summary AS
SELECT
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
    COUNT(o.order_id) AS total_orders,
    ROUND(
        COALESCE(
            SUM(
                CASE
                    WHEN o.order_status = 'Delivered'
                    THEN o.total_amount
                    ELSE 0
                END
            ),
            0
        ),
        2
    ) AS total_spent
FROM users u
LEFT JOIN orders o
    ON u.user_id = o.user_id
GROUP BY
    u.user_id,
    u.first_name,
    u.last_name;
    
--

SELECT *
FROM customer_order_summary
ORDER BY total_spent DESC
LIMIT 10;

-- ********************************

CREATE OR REPLACE VIEW monthly_sales_summary AS
SELECT
    DATE_FORMAT(order_date, '%Y-%m') AS sales_month,
    COUNT(order_id) AS total_orders,
    ROUND(SUM(total_amount), 2) AS total_revenue,
    ROUND(AVG(total_amount), 2) AS average_order_value
FROM orders
WHERE order_status = 'Delivered'
GROUP BY DATE_FORMAT(order_date, '%Y-%m');

--

SELECT *
FROM monthly_sales_summary
ORDER BY sales_month;

-- **************************
SHOW CREATE VIEW product_sales_summary;