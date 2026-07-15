const pool = require("../config/db")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
};

// REGISTER USER
const register = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            phone,
            gender,
            date_of_birth
        } = req.body;

        // Basic validation
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "First name, last name, email and password are required"
            });
        }

        // Check whether email already exists
        const [existingUsers] = await pool.query(
            `SELECT user_id
             FROM users
             WHERE email = ?`,
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password,10);

        // Insert user
        const [result] = await pool.query(
            `INSERT INTO users (
                first_name,
                last_name,
                email,
                password_hash,
                phone,
                gender,
                date_of_birth,
                account_status,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', NOW())`,
            [
                first_name,
                last_name,
                email,
                passwordHash,
                phone || null,
                gender || null,
                date_of_birth || null
            ]
        );

        const token = generateToken(result.insertId);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            data: {
                user_id: result.insertId,
                first_name,
                last_name,
                email
            }
        });
    }catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to register user"
        });
    }
}

// LOGIN USER
const login  = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password){
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const [users] = await pool.query(
            `SELECT
                user_id,
                first_name,
                last_name,
                email,
                password_hash,
                account_status
             FROM users
             WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // Check account status
        if (user.account_status !== "Active") {
            return res.status(403).json({
                success: false,
                message: "Account is not active"
            });
        }

        // Compare entered password with hashed password
        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        await pool.query(
            `UPDATE users
             SET last_login = NOW()
             WHERE user_id = ?`,
            [user.user_id]
        );

        const token = generateToken(user.user_id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        });
    }catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to login"
        });
    }
}

const getMe = async (req, res) => {
    try {
        const [users] = await pool.query(
            `SELECT
                user_id,
                first_name,
                last_name,
                email,
                phone,
                gender,
                date_of_birth,
                account_status,
                created_at,
                last_login
             FROM users
             WHERE user_id = ?`,
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: users[0]
        });

    } catch (error) {
        console.error("Get current user error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch user"
        });
    }
};

module.exports = {register, login, getMe};