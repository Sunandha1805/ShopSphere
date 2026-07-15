const express = require("express");

const {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview
} = require("../controllers/reviewController");

const { protect} = require("../middleware/authMiddleware");

const router = express.Router();


// Public
router.get("/products/:productId/reviews", getProductReviews);
// Protected
router.post("/products/:productId/reviews", protect, createReview);
router.put("/reviews/:id", protect, updateReview);
router.delete("/reviews/:id", protect, deleteReview);

module.exports = router;