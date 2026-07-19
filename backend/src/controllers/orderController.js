const pool = require("../config/db");

const checkout = async (req, res) => {
    const  connection = await pool.getConnection();
    try {
        const userId = req.user.userId;
        const {
            address_id,
            payment_method
        } = req.body;

        // Validation
        if(!address_id || !payment_method) {
            return res.status(400).json({
                success: false,
                message: "Address and payment method are required"
            });
        }

        await connection.beginTransaction();

        // Rest of logic will come here
        // Check whether address belongs to logged-in user
        const [addresses] = await connection.query(
            `SELECT address_id
            FROM addresses
            WHERE address_id = ?
            AND user_id = ?`,
            [address_id, userId]
        );

        if (addresses.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Address not found"
            });

        }

        // Find user's cart
        const [carts] = await connection.query(
            `SELECT cart_id
            FROM cart
            WHERE user_id = ?`,
            [userId]
        );

        if (carts.length === 0) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });

        }

        const cartId = carts[0].cart_id;

        // Get all items in cart

        const [cartItems] = await connection.query(
            `SELECT
                ci.cart_item_id,
                ci.product_id,
                ci.quantity,
                p.product_name,
                p.price,
                p.stock_quantity
            FROM cart_items ci

            JOIN products p
                ON ci.product_id = p.product_id

            WHERE ci.cart_id = ?`,
            [cartId]
        );

        if (cartItems.length === 0) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });

        }

        // Calculate total amount
        let totalAmount = 0;

        for(const item of cartItems){
            // check stock
            if(item.quantity > item.stock_quantity){
                
                await connection.rollback();

                return res.status(400).json({
                    success: false,
                    message: `${item.product_name} has only ${item.stock_quantity} item(s) available`
                });
            }

            const subtotal = item.price * item.quantity;
        
            totalAmount += subtotal;
        }

        totalAmount = Number(totalAmount.toFixed(2));

        // Create Order
        const [orderResult] = await connection.query(
            `INSERT INTO orders (
                user_id,
                address_id,
                order_date,
                order_status,
                payment_status,
                total_amount
            )
            VALUES (?, ?, NOW(), ?, ?, ?)`,
            [userId, address_id, "Confirmed", "Paid", totalAmount]
        );

        const orderId = orderResult.insertId;

        // Insert Order Items
        for (const item of cartItems) {

            const subtotal = Number(item.price) * Number(item.quantity);

            await connection.query(
                `INSERT INTO order_items (
                    order_id,
                    product_id,
                    quantity,
                    price,
                    subtotal
                )
                VALUES (?, ?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price, subtotal]
            );

        }

        // Create Payment Record
        const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

        await connection.query(
            `INSERT INTO payments (
                order_id,
                payment_method,
                payment_status,
                payment_date,
                amount,
                transaction_id
            )
            VALUES (?, ?, ?, NOW(), ?, ?)`,
            [ orderId, payment_method, "Success", totalAmount, transactionId]
        );

        // Update Product Stock
        for (const item of cartItems) {

            await connection.query(
                `UPDATE products
                SET stock_quantity = stock_quantity - ?
                WHERE product_id = ?`,
                [item.quantity, item.product_id]
            );

        }
        
        // Clear Cart
        await connection.query(
            `DELETE
            FROM cart_items
            WHERE cart_id = ?`,
            [cartId]
        );

        await connection.commit();

        res.status(201).json({

            success: true,
            message: "Order placed successfully",
            data: {
                order_id: orderId,
                total_amount: totalAmount,
                total_items: cartItems.length,
                payment_method: payment_method,
                payment_status: "Success",
                order_status: "Confirmed"

            }
        });

    }catch (error) {

        await connection.rollback();

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Checkout failed"
        });

    }finally {
        connection.release();
    }
}

const getMyOrders = async (req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT
                o.order_id,
                o.order_date,
                o.order_status,
                o.payment_status,
                o.total_amount,
                COUNT(oi.order_item_id) AS item_count,
                (
                    SELECT p.image_url
                    FROM order_items oi2
                    JOIN products p ON oi2.product_id = p.product_id
                    WHERE oi2.order_id = o.order_id
                    LIMIT 1
                ) AS preview_image_1,
                (
                    SELECT p.image_url
                    FROM order_items oi3
                    JOIN products p ON oi3.product_id = p.product_id
                    WHERE oi3.order_id = o.order_id
                    LIMIT 1 OFFSET 1
                ) AS preview_image_2
             FROM orders o
             LEFT JOIN order_items oi ON o.order_id = oi.order_id
             WHERE o.user_id = ?
             GROUP BY o.order_id
             ORDER BY o.order_date DESC`,
            [req.user.userId]
        );

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id: orderId } = req.params;
        const userId = req.user.userId;

        const [orders] = await pool.query(
            `SELECT
                o.order_id,
                o.order_date,
                o.order_status,
                o.payment_status,
                o.total_amount,
                a.address_line1,
                a.address_line2,
                a.city,
                a.state,
                a.pincode,
                a.country,
                p.payment_method,
                p.transaction_id,
                p.payment_date
             FROM orders o
             JOIN addresses a ON o.address_id = a.address_id
             JOIN payments p ON o.order_id = p.order_id
             WHERE o.order_id = ? AND o.user_id = ?`,
            [orderId, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const [items] = await pool.query(
            `SELECT
                oi.order_item_id,
                oi.product_id,
                p.product_name,
                p.image_url,
                p.brand,
                oi.quantity,
                oi.price,
                oi.subtotal
             FROM order_items oi
             JOIN products p ON oi.product_id = p.product_id
             WHERE oi.order_id = ?`,
            [orderId]
        );

        res.status(200).json({
            success: true,
            order: orders[0],
            items
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch order"
        });
    }
};

const cancelOrder = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { id: orderId } = req.params;
        const userId = req.user.userId;

        await connection.beginTransaction();

        const [orders] = await connection.query(
            `SELECT order_status
             FROM orders
             WHERE order_id = ? AND user_id = ?`,
            [orderId, userId]
        );

        if (orders.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const { order_status } = orders[0];

        if (["Delivered", "Cancelled", "Returned"].includes(order_status)) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: `Cannot cancel a ${order_status.toLowerCase()} order`
            });
        }

        const [items] = await connection.query(
            `SELECT product_id, quantity
             FROM order_items
             WHERE order_id = ?`,
            [orderId]
        );

        for (const item of items) {
            await connection.query(
                `UPDATE products
                 SET stock_quantity = stock_quantity + ?
                 WHERE product_id = ?`,
                [item.quantity, item.product_id]
            );
        }

        await connection.query(
            `UPDATE orders
             SET order_status = 'Cancelled',
                 payment_status = 'Refunded'
             WHERE order_id = ?`,
            [orderId]
        );

        await connection.query(
            `UPDATE payments
             SET payment_status = 'Refunded'
             WHERE order_id = ?`,
            [orderId]
        );

        await connection.commit();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully"
        });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to cancel order"
        });
    } finally {
        connection.release();
    }
};

module.exports = {checkout, getMyOrders, getOrderById, cancelOrder};