const pool  = require("../config/db");

const getAllProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            sort
        } = req.query;

        // Pagination
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 20, 1),
            100
        );

        const offset = (page - 1) * limit;

        // Base query
        let query = `
            SELECT
                p.product_id,
                p.category_id,
                c.category_name,
                p.product_name,
                p.brand,
                p.price,
                p.discount_percent,
                p.stock_quantity,
                p.image_url,
                p.rating
            FROM products p
            JOIN categories c
                ON p.category_id = c.category_id
            WHERE 1 = 1
        `;

        // Separate query to count matching products
        let countQuery = `
            SELECT COUNT(*) AS total
            FROM products p
            JOIN categories c
                ON p.category_id = c.category_id
            WHERE 1 = 1
        `;

        const values = [];
        const countValues = [];

        // Search
        if (search) {
            const searchCondition = `
                AND (
                    p.product_name LIKE ?
                    OR p.brand LIKE ?
                )
            `;

            query += searchCondition;
            countQuery += searchCondition;

            const searchValue = `%${search}%`;

            values.push(searchValue, searchValue);
            countValues.push(searchValue, searchValue);
        }

        // Category filter
        if (category) {
            query += ` AND p.category_id = ?`;
            countQuery += ` AND p.category_id = ?`;

            values.push(category);
            countValues.push(category);
        }

        // Minimum price
        if (minPrice) {
            query += ` AND p.price >= ?`;
            countQuery += ` AND p.price >= ?`;

            values.push(minPrice);
            countValues.push(minPrice);
        }

        // Maximum price
        if (maxPrice) {
            query += ` AND p.price <= ?`;
            countQuery += ` AND p.price <= ?`;

            values.push(maxPrice);
            countValues.push(maxPrice);
        }

        // Sorting
        switch (sort) {
            case "price_asc":
                query += ` ORDER BY p.price ASC`;
                break;

            case "price_desc":
                query += ` ORDER BY p.price DESC`;
                break;

            case "rating_desc":
                query += ` ORDER BY p.rating DESC`;
                break;

            case "name_asc":
                query += ` ORDER BY p.product_name ASC`;
                break;

            default:
                query += ` ORDER BY p.product_id ASC`;
        }

        // Pagination
        query += ` LIMIT ? OFFSET ?`;

        values.push(limit, offset);

        // Execute both queries
        const [products] = await pool.query(query, values);

        const [countResult] = await pool.query(
            countQuery,
            countValues
        );

        const totalProducts = countResult[0].total;
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            success: true,

            pagination: {
                currentPage: page,
                limit: limit,
                totalProducts: totalProducts,
                totalPages: totalPages
            },

            data: products
        });

    } catch (error) {
        console.error("Error fetching products:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        const [products] = await pool.query(
            `SELECT
                p.product_id,
                p.product_name,
                p.brand,
                p.description,
                p.price,
                p.discount_percent,
                p.stock_quantity,
                p.image_url,
                p.rating,
                c.category_id,
                c.category_name
            FROM products p
            JOIN categories c
                ON p.category_id = c.category_id
            WHERE p.product_id = ?`,
            [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            data: products[0]
        });
    }catch (error) {
        console.error("Error fetching product:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch product"
        });
    }
}

module.exports = {getAllProducts, getProductById}