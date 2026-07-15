const pool = require("../config/db");


// GET ALL REVIEWS FOR A PRODUCT
const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Check whether product exists
        const [products] = await pool.query(
            `SELECT product_id
             FROM products
             WHERE product_id = ?`,
            [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Get reviews
        const [reviews] = await pool.query(
            `SELECT
                r.review_id,
                r.user_id,
                CONCAT(
                    u.first_name,
                    ' ',
                    u.last_name
                ) AS customer_name,
                r.rating,
                r.review_text,
                r.review_date
             FROM reviews r
             JOIN users u
                ON r.user_id = u.user_id
             WHERE r.product_id = ?
             ORDER BY r.review_date DESC`,
            [productId]
        );

        // Get review summary
        const [summary] = await pool.query(
            `SELECT
                COUNT(*) AS total_reviews,
                ROUND(
                    AVG(rating),
                    2
                ) AS average_rating
             FROM reviews
             WHERE product_id = ?`,
            [productId]
        );

        res.status(200).json({
            success: true,
            summary: {
                total_reviews:
                    summary[0].total_reviews,
                average_rating:
                    summary[0].average_rating
            },
            data: reviews
        });

    } catch (error) {
        console.error("Error fetching reviews:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch reviews"
        });
    }
};


// CREATE REVIEW
const createReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const productId = req.params.productId;

        const {
            rating,
            review_text
        } = req.body;

        const parsedRating = Number(rating);

        // Validate rating
        if (
            !Number.isInteger(parsedRating) ||
            parsedRating < 1 ||
            parsedRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5"
            });
        }

        // Check whether product exists
        const [products] = await pool.query(
            `SELECT product_id
             FROM products
             WHERE product_id = ?`,
            [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check whether user already reviewed product
        const [existingReviews] = await pool.query(
            `SELECT review_id
             FROM reviews
             WHERE user_id = ?
             AND product_id = ?`,
            [userId, productId]
        );

        if (existingReviews.length > 0) {
            return res.status(409).json({
                success: false,
                message: "You have already reviewed this product"
            });
        }

        // Insert review
        const [result] = await pool.query(
            `INSERT INTO reviews (
                user_id,
                product_id,
                rating,
                review_text,
                review_date
             )
             VALUES (?, ?, ?, ?, NOW())`,
            [
                userId,
                productId,
                parsedRating,
                review_text || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            data: {
                review_id: result.insertId
            }
        });

    } catch (error) {
        console.error("Error creating review:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add review"
        });
    }
};


// UPDATE REVIEW
const updateReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const reviewId = req.params.id;

        const {
            rating,
            review_text
        } = req.body;

        const parsedRating = Number(rating);

        if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5"
            });
        }

        // Check review and ownership
        const [reviews] = await pool.query(
            `SELECT review_id
             FROM reviews
             WHERE review_id = ?
             AND user_id = ?`,
            [reviewId, userId]
        );

        if (reviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Review not found or you are not authorized to update it"
            });
        }

        await pool.query(
            `UPDATE reviews
             SET
                rating = ?,
                review_text = ?,
                review_date = NOW()
             WHERE review_id = ?
             AND user_id = ?`,
            [parsedRating, review_text || null, reviewId, userId]
        );

        res.status(200).json({
            success: true,
            message: "Review updated successfully"
        });

    } catch (error) {
        console.error("Error updating review:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update review"
        });
    }
};


// DELETE REVIEW
const deleteReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const reviewId = req.params.id;

        const [result] = await pool.query(
            `DELETE FROM reviews
             WHERE review_id = ?
             AND user_id = ?`,
            [reviewId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Review not found or you are not authorized to delete it"
            });
        }

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting review:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete review"
        });
    }
};


module.exports = {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview
};