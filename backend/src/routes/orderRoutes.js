const express = require("express");

const { 
    checkout, 
    getMyOrders,
    getOrderById,
    cancelOrder 
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/checkout", protect, checkout);
router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;