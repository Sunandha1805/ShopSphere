const pool = require("../config/db");

// GET all categories
const getAllCategories = async (req, res) => {
    try {
        const [categories] = await pool.query(`
            SELECT
                c.category_id,
                c.category_name,
                c.description,
                COUNT(p.product_id) AS product_count
            FROM categories c
            LEFT JOIN products p
                ON c.category_id = p.category_id
            GROUP BY
                c.category_id,
                c.category_name,
                c.description
            ORDER BY c.category_name ASC
        `);

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    }catch (error) {
        console.error("Error fetching categories:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch categories"
        });
    }
}

// GET category by ID
const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const [categories] = await pool.query(
            `
            SELECT
                c.category_id,
                c.category_name,
                c.description,
                COUNT(p.product_id) AS product_count
            FROM categories c
            LEFT JOIN products p
                ON c.category_id = p.category_id
            WHERE c.category_id = ?
            GROUP BY
                c.category_id,
                c.category_name,
                c.description
            `,
            [categoryId]
        );

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            data: categories[0]
        });

    } catch (error) {
        console.error("Error fetching category:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch category"
        });
    }
};


module.exports = {
    getAllCategories,
    getCategoryById
};