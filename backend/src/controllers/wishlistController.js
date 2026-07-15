const pool = require("../config/db");


// Helper: Get existing wishlist or create one
const getOrCreateWishlist = async (userId, connection = pool) => {

    const [wishlists] = await connection.query(
        `SELECT wishlist_id
         FROM wishlist
         WHERE user_id = ?
         LIMIT 1`,
        [userId]
    );

    if (wishlists.length > 0) {
        return wishlists[0].wishlist_id;
    }

    const [result] = await connection.query(
        `INSERT INTO wishlist (
            user_id,
            created_at
         )
         VALUES (?, NOW())`,
        [userId]
    );

    return result.insertId;
};

// GET WISHLIST
const getWishlist = async (req, res) => {

    try {
        const userId = req.user.userId;

        const [wishlists] = await pool.query(
            `SELECT wishlist_id
             FROM wishlist
             WHERE user_id = ?
             LIMIT 1`,
            [userId]
        );

        // User does not have a wishlist yet
        if (wishlists.length === 0) {

            return res.status(200).json({
                success: true,
                data: {
                    wishlist_id: null,
                    items: []
                }
            });
        }

        const wishlistId = wishlists[0].wishlist_id;

        const [items] = await pool.query(
            `SELECT
                wi.wishlist_item_id,
                wi.product_id,
                p.product_name,
                p.brand,
                p.price,
                p.discount_percent,
                p.stock_quantity,
                p.image_url,
                p.rating,
                wi.added_at
             FROM wishlist_items wi
             JOIN products p
                ON wi.product_id =
                   p.product_id
             WHERE wi.wishlist_id = ?
             ORDER BY wi.added_at DESC`,
            [wishlistId]
        );

        res.status(200).json({
            success: true,
            data: {
                wishlist_id: wishlistId,
                count: items.length,
                items
            }
        });

    } catch (error) {
        console.error("Error fetching wishlist:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch wishlist"
        });
    }
};

// ADD PRODUCT TO WISHLIST
const addToWishlist = async (req, res) => {

    const connection = await pool.getConnection();

    try {
        const userId = req.user.userId;

        const { product_id } = req.body;

        if (!product_id) {

            return res.status(400).json({
                success: false,
                message: "product_id is required"
            });
        }

        await connection.beginTransaction();

        // Check whether product exists
        const [products] = await connection.query(
                `SELECT product_id
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

        // Get or create wishlist
        const wishlistId = await getOrCreateWishlist(userId, connection);

        // Check if product is already in the wishlist
        const [existingItems] = await connection.query(
                `SELECT wishlist_item_id
                 FROM wishlist_items
                 WHERE wishlist_id = ?
                 AND product_id = ?`,
                [wishlistId, product_id]
            );

        if (existingItems.length > 0) {

            await connection.rollback();

            return res.status(409).json({
                success: false,
                message: "Product is already in wishlist"
            });
        }

        // Add product
        const [result] = await connection.query(
                `INSERT INTO wishlist_items (
                    wishlist_id,
                    product_id,
                    added_at
                 )
                 VALUES (?, ?, NOW())`,
                [wishlistId, product_id]
            );

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Product added to wishlist successfully",
            data: {
                wishlist_item_id: result.insertId
            }
        });

    } catch (error) {

        await connection.rollback();

        console.error("Error adding to wishlist:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add product to wishlist"
        });

    } finally {
        connection.release();
    }
};

// REMOVE ONE ITEM FROM WISHLIST
const removeWishlistItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const wishlistItemId = req.params.id;

        const [result] =
            await pool.query(
                `DELETE wi
                 FROM wishlist_items wi

                 JOIN wishlist w
                    ON wi.wishlist_id = w.wishlist_id

                 WHERE wi.wishlist_item_id = ?
                 AND w.user_id = ?`,
                [wishlistItemId, userId]
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Wishlist item not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        });

    } catch (error) {

        console.error("Error removing wishlist item:", error);

        res.status(500).json({
            success: false,
            message: "Failed to remove product from wishlist"
        });
    }
};


// CLEAR ENTIRE WISHLIST
const clearWishlist = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [result] =
            await pool.query(
                `DELETE wi
                 FROM wishlist_items wi

                 JOIN wishlist w
                    ON wi.wishlist_id = w.wishlist_id

                 WHERE w.user_id = ?`,
                [userId]
            );

        res.status(200).json({
            success: true,
            message: "Wishlist cleared successfully",
            removed_items: result.affectedRows
        });

    } catch (error) {
        console.error("Error clearing wishlist:", error);

        res.status(500).json({
            success: false,
            message: "Failed to clear wishlist"
        });
    }
};


module.exports = {
    getWishlist,
    addToWishlist,
    removeWishlistItem,
    clearWishlist
};