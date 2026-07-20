const express = require("express");

const {
    getWishlist,
    addToWishlist,
    removeWishlistItem,
    removeWishlistByProductId,
    clearWishlist
} = require("../controllers/wishlistController");

const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

// All wishlist routes require login
router.use(protect);

router.get("/", getWishlist);
router.post("/items", addToWishlist);
router.delete("/items/:id", removeWishlistItem);
router.delete("/product/:productId", removeWishlistByProductId);
router.delete("/", clearWishlist);

module.exports = router;