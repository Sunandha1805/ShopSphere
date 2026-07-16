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

module.exports = {checkout};