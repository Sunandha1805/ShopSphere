const pool = require("../config/db");


// Helper: Get existing cart or create one
const getOrCreateCart = async (userId, connection = pool) => {

    const [carts] = await connection.query(
        `SELECT cart_id
         FROM cart
         WHERE user_id = ?
         LIMIT 1`,
        [userId]
    );

    if (carts.length > 0) {
        return carts[0].cart_id;
    }

    const [result] = await connection.query(
        `INSERT INTO cart (
            user_id,
            created_at,
            updated_at
         )
         VALUES (?, NOW(), NOW())`,
        [userId]
    );

    return result.insertId;
};


// GET CART
const getCart = async (req, res) => {

    try {

        const userId = req.user.userId;

        const [carts] = await pool.query(
            `SELECT cart_id
             FROM cart
             WHERE user_id = ?
             LIMIT 1`,
            [userId]
        );

        // User does not have a cart yet
        if (carts.length === 0) {

            return res.status(200).json({
                success: true,
                data: {
                    cart_id: null,
                    items: [],
                    total_items: 0,
                    total_amount: 0
                }
            });
        }

        const cartId = carts[0].cart_id;

        const [items] = await pool.query(
            `SELECT
                ci.cart_item_id,
                ci.product_id,
                p.product_name,
                p.brand,
                p.price,
                p.discount_percent,
                p.stock_quantity,
                p.image_url,
                ci.quantity,
                ROUND(
                    p.price * ci.quantity,
                    2
                ) AS subtotal
             FROM cart_items ci
             JOIN products p
                ON ci.product_id = p.product_id
             WHERE ci.cart_id = ?
             ORDER BY ci.cart_item_id DESC`,
            [cartId]
        );

        const totalItems = items.reduce(
            (total, item) =>
                total + Number(item.quantity),
            0
        );

        const totalAmount = items.reduce(
            (total, item) =>
                total + Number(item.subtotal),
            0
        );

        res.status(200).json({
            success: true,
            data: {
                cart_id: cartId,
                items,
                total_items: totalItems,
                total_amount: Number(
                    totalAmount.toFixed(2)
                )
            }
        });

    } catch (error) {

        console.error(
            "Error fetching cart:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch cart"
        });
    }
};


// ADD ITEM TO CART
const addToCart = async (req, res) => {

    const connection =
        await pool.getConnection();

    try {

        const userId = req.user.userId;

        const {
            product_id,
            quantity = 1
        } = req.body;

        const parsedQuantity =
            Number(quantity);

        if (
            !product_id ||
            !Number.isInteger(parsedQuantity) ||
            parsedQuantity < 1
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Valid product_id and quantity are required"
            });
        }

        await connection.beginTransaction();

        // Check product
        const [products] =
            await connection.query(
                `SELECT
                    product_id,
                    stock_quantity
                 FROM products
                 WHERE product_id = ?`,
                [product_id]
            );

        if (products.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const availableStock =
            products[0].stock_quantity;

        // Get or create user's cart
        const cartId =
            await getOrCreateCart(
                userId,
                connection
            );

        // Check if product already exists
        const [existingItems] =
            await connection.query(
                `SELECT
                    cart_item_id,
                    quantity
                 FROM cart_items
                 WHERE cart_id = ?
                 AND product_id = ?`,
                [cartId, product_id]
            );

        if (existingItems.length > 0) {

            const newQuantity =
                Number(
                    existingItems[0].quantity
                ) + parsedQuantity;

            if (
                newQuantity >
                availableStock
            ) {

                await connection.rollback();

                return res.status(400).json({
                    success: false,
                    message:
                        "Requested quantity exceeds available stock"
                });
            }

            await connection.query(
                `UPDATE cart_items
                 SET quantity = ?
                 WHERE cart_item_id = ?`,
                [
                    newQuantity,
                    existingItems[0]
                        .cart_item_id
                ]
            );

        } else {

            if (
                parsedQuantity >
                availableStock
            ) {

                await connection.rollback();

                return res.status(400).json({
                    success: false,
                    message:
                        "Requested quantity exceeds available stock"
                });
            }

            await connection.query(
                `INSERT INTO cart_items (
                    cart_id,
                    product_id,
                    quantity
                 )
                 VALUES (?, ?, ?)`,
                [
                    cartId,
                    product_id,
                    parsedQuantity
                ]
            );
        }

        await connection.query(
            `UPDATE cart
             SET updated_at = NOW()
             WHERE cart_id = ?`,
            [cartId]
        );

        await connection.commit();

        res.status(200).json({
            success: true,
            message:
                "Product added to cart successfully"
        });

    } catch (error) {

        await connection.rollback();

        console.error(
            "Error adding to cart:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to add product to cart"
        });

    } finally {

        connection.release();
    }
};


// UPDATE CART ITEM QUANTITY
const updateCartItem = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.userId;

        const cartItemId =
            req.params.id;

        const quantity =
            Number(req.body.quantity);

        if (
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be at least 1"
            });
        }

        // Find cart item and verify ownership
        const [items] =
            await pool.query(
                `SELECT
                    ci.cart_item_id,
                    ci.product_id,
                    p.stock_quantity
                 FROM cart_items ci

                 JOIN cart c
                    ON ci.cart_id =
                       c.cart_id

                 JOIN products p
                    ON ci.product_id =
                       p.product_id

                 WHERE ci.cart_item_id = ?
                 AND c.user_id = ?`,
                [
                    cartItemId,
                    userId
                ]
            );

        if (items.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Cart item not found"
            });
        }

        if (
            quantity >
            items[0].stock_quantity
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Requested quantity exceeds available stock"
            });
        }

        await pool.query(
            `UPDATE cart_items
             SET quantity = ?
             WHERE cart_item_id = ?`,
            [
                quantity,
                cartItemId
            ]
        );

        res.status(200).json({
            success: true,
            message:
                "Cart item updated successfully"
        });

    } catch (error) {

        console.error(
            "Error updating cart item:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to update cart item"
        });
    }
};


// REMOVE ONE ITEM FROM CART
const removeCartItem = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.userId;

        const cartItemId =
            req.params.id;

        const [result] =
            await pool.query(
                `DELETE ci
                 FROM cart_items ci

                 JOIN cart c
                    ON ci.cart_id =
                       c.cart_id

                 WHERE ci.cart_item_id = ?
                 AND c.user_id = ?`,
                [
                    cartItemId,
                    userId
                ]
            );

        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({
                success: false,
                message:
                    "Cart item not found"
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Product removed from cart"
        });

    } catch (error) {

        console.error(
            "Error removing cart item:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to remove product from cart"
        });
    }
};


// CLEAR ENTIRE CART
const clearCart = async (req, res) => {

    try {

        const userId =
            req.user.userId;

        const [result] =
            await pool.query(
                `DELETE ci
                 FROM cart_items ci

                 JOIN cart c
                    ON ci.cart_id =
                       c.cart_id

                 WHERE c.user_id = ?`,
                [userId]
            );

        res.status(200).json({
            success: true,
            message:
                "Cart cleared successfully",
            removed_items:
                result.affectedRows
        });

    } catch (error) {

        console.error(
            "Error clearing cart:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to clear cart"
        });
    }
};


module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
};