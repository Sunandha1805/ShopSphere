const pool = require("../config/db")

// GET LOGGED-IN USER'S ADDRESSES
const getAddresses = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [addresses] = await pool.query(
            `SELECT
                address_id,
                address_type,
                address_line1,
                address_line2,
                city,
                state,
                pincode,
                country,
                is_default
            FROM addresses
            WHERE user_id = ?
            ORDER BY is_default DESC, address_id DESC`,
            [userId]
        );

        res.status(200).json({
            success: true,
            count: addresses.length,
            data: addresses
        });
    }catch (error) {
        console.error("Error fetching addresses:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch addresses"
        });
    }
}

// Add Address
const addAddress = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const userId = req.user.userId;

        const {
            address_type,
            address_line1,
            address_line2,
            city,
            state,
            pincode,
            country,
            is_default
        } = req.body;

        if (
            !address_line1 ||
            !city ||
            !state ||
            !pincode ||
            !country
        ) {
            return res.status(400).json({
                success: false,
                message: "Required address fields are missing"
            });
        }

        await connection.beginTransaction();

        // If new address is default,
        // remove default status from existing addresses
        if (is_default) {
            await connection.query(
                `UPDATE addresses
                 SET is_default = 0
                 WHERE user_id = ?`,
                [userId]
            );
        }

        const [result] = await connection.query(
            `INSERT INTO addresses (
                user_id,
                address_type,
                address_line1,
                address_line2,
                city,
                state,
                pincode,
                country,
                is_default
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                address_type || "Home",
                address_line1,
                address_line2 || null,
                city,
                state,
                pincode,
                country,
                is_default ? 1 : 0
            ]
        );

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Address added successfully",
            data: {
                address_id: result.insertId
            }
        });

    } catch (error) {
        await connection.rollback();

        console.error("Error adding address:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add address"
        });

    } finally {
        connection.release();
    }
};

// UPDATE ADDRESS
const updateAddress = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const userId = req.user.userId;
        const addressId = req.params.id;

        const {
            address_type,
            address_line1,
            address_line2,
            city,
            state,
            pincode,
            country,
            is_default
        } = req.body;

        // Check ownership
        const [existingAddress] = await connection.query(
            `SELECT address_id
             FROM addresses
             WHERE address_id = ?
             AND user_id = ?`,
            [addressId, userId]
        );

        if (existingAddress.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        if (
            !address_line1 ||
            !city ||
            !state ||
            !pincode ||
            !country
        ) {
            return res.status(400).json({
                success: false,
                message: "Required address fields are missing"
            });
        }

        await connection.beginTransaction();

        if (is_default) {
            await connection.query(
                `UPDATE addresses
                 SET is_default = 0
                 WHERE user_id = ?`,
                [userId]
            );
        }

        await connection.query(
            `UPDATE addresses
             SET
                address_type = ?,
                address_line1 = ?,
                address_line2 = ?,
                city = ?,
                state = ?,
                pincode = ?,
                country = ?,
                is_default = ?
             WHERE address_id = ?
             AND user_id = ?`,
            [
                address_type || "Home",
                address_line1,
                address_line2 || null,
                city,
                state,
                pincode,
                country,
                is_default ? 1 : 0,
                addressId,
                userId
            ]
        );

        await connection.commit();

        res.status(200).json({
            success: true,
            message: "Address updated successfully"
        });

    } catch (error) {
        await connection.rollback();

        console.error("Error updating address:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update address"
        });

    } finally {
        connection.release();
    }
};

// DELETE ADDRESS
const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const addressId = req.params.id;

        const [result] = await pool.query(
            `DELETE FROM addresses
             WHERE address_id = ?
             AND user_id = ?`,
            [addressId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting address:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete address"
        });
    }
};

module.exports = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress
};