const express = require("express");;

const {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress
} = require("../controllers/addressController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All address routes are protected
router.use(protect);

router.get("/", getAddresses);
router.post("/", addAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

module.exports = router;