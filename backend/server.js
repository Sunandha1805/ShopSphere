require("dotenv").config();

const app = require("./src/app");
const pool = require("./src/config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        const connection = await pool.getConnection();
        console.log("MySql database connected successfully");
        connection.release();

        app.listen(PORT, () => {
            console.log(`ShopSphere server running on port ${PORT}`);
        });
    }catch (error) {
        console.error("Database connection failed", error.message);
        process.exit(1);
    }
}

startServer();