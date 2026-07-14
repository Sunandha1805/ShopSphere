# ShopSphere Database Project

ShopSphere is a comprehensive, mid-scale relational database modeling an e-commerce platform. The project is designed to handle common e-commerce features including user management, product cataloging, shopping carts, wishlists, order processing, payments, and product reviews. It demonstrates advanced SQL capabilities and robust database design principles.

## Problem Statement
Designing a resilient and scalable database for an e-commerce platform requires careful consideration of data integrity, complex relationships, and concurrent operations. The goal of this project is to model a robust relational database schema that ensures data consistency and supports complex analytical queries. It tackles real-world scenarios such as stock management during order placement, complex data aggregations for reporting, and transactional integrity using advanced SQL concepts like triggers, stored procedures, and transactions.

## Database Schema
The database (`ecommerce_db`) consists of several interconnected tables carefully normalized to reduce redundancy and maintain data integrity.

*   **`users`**: Stores customer details, authentication information, and account status.
*   **`categories`**: Product classifications.
*   **`products`**: Inventory of items available for sale, including price, stock, and ratings. Linked to categories.
*   **`addresses`**: Multiple shipping/billing addresses for users.
*   **`cart` & `cart_items`**: Manages active shopping sessions for users.
*   **`wishlist` & `wishlist_items`**: Saves user preferences for future purchases.
*   **`orders` & `order_items`**: Records user purchases, order status, and itemized billing.
*   **`payments`**: Tracks transaction details and payment statuses for orders.
*   **`reviews`**: Customer feedback and ratings for purchased products.

## Entity-Relationship (ER) Diagram
An ER diagram outlining the relationships between all entities is available in the project.
You can view it here: `database/diagram/er_diagram.png`

## Dataset & Database Size
Realistic seed data is generated using a custom Python script, leveraging an external Amazon dataset to populate product information. 

The configuration generates a substantial dataset to simulate a mid-scale application environment:
*   **Users:** 10,000
*   **Products:** 5,000
*   **Categories:** 20
*   **Addresses:** 15,000
*   **Orders:** 50,000
*   **Order Items:** 150,000
*   **Payments:** 50,000
*   **Reviews:** 25,000

In total, the generated dataset yields over **300,000 records**, allowing for robust testing of query performance and indexing strategies.

## Key SQL Concepts Demonstrated

### Important Queries
The project includes a rich set of analytical and operational queries (`queries.sql`):
*   **Aggregations & Grouping:** Monthly sales reports, products per category, and overall order statistics.
*   **Joins:** Complex multi-table joins to retrieve complete order details and best-selling products.
*   **Subqueries & EXISTS:** Finding users with no orders or products never ordered.
*   **Common Table Expressions (CTEs):** Calculating customer spending and tracking month-over-month revenue changes.
*   **Window Functions:** Using `RANK()`, `DENSE_RANK()`, and `LAG()` to rank customer spending, rank product prices within categories, and calculate revenue differences between consecutive months.
*   **Views:** A reusable `product_sales_summary` view to simplify complex revenue queries.

### Triggers
Triggers are implemented (`trigger.sql`) to automatically maintain data integrity, specifically for stock management:
*   **`check_product_stock` / `check_stock_before_update`**: Validates if sufficient stock exists before allowing an order item to be inserted or its quantity increased. Throws an error (SQLSTATE '45000') if stock is insufficient.
*   **`reduce_stock_quantity`**: Automatically deducts the purchased quantity from product stock after an order item is inserted.
*   **`update_stock_quantity`**: Adjusts the product stock appropriately when an order item's quantity is updated.
*   **`restore_stock_quantity`**: Reverts the stock back to the inventory if an order item is deleted.

### Transactions & Stored Procedures
To ensure atomicity during complex multi-step operations, transactions are utilized (`transactions.sql`, `stored_procedure.sql`).

*   **`PlaceOrder` Stored Procedure**: A complete, encapsulated workflow that:
    1.  Starts a transaction.
    2.  Calculates total amounts based on current product prices.
    3.  Creates an `orders` record.
    4.  Creates `order_items` (which automatically fires stock-reducing triggers).
    5.  Creates a `payments` record.
    6.  Commits the transaction if all steps succeed, or triggers a `ROLLBACK` via a `SQLEXCEPTION` handler if any error occurs (e.g., insufficient stock).

### Indexing
Performance optimization is explored by implementing indexes (`ecommerce_db.sql`) on frequently queried columns and foreign keys (e.g., `user_id`, `category_id`, `order_date`, `product_id`). Execution plans (`EXPLAIN`) are used to analyze query performance before and after index creation.

## How to Run the Project

### Prerequisites
1.  Python 3.x
2.  MySQL Server

### Setup Instructions
1.  **Clone the Repository** and navigate to the project directory.
2.  **Generate Seed Data:**
    *   Set up a Python virtual environment: `python -m venv venv`
    *   Activate the environment (e.g., `.\venv\Scripts\activate` on Windows).
    *   Install the required dependencies: `pip install -r requirements.txt`
    *   Navigate to the generator directory: `cd database/generator`
    *   Run the data generator: `python generate_data.py`. This will create CSV files in the `database/seed_data` folder based on the parameters set in `config.py`.
3.  **Create the Database Schema:**
    *   Open your MySQL client or command line.
    *   Execute the `ecommerce_db.sql` script located in `database/schema/` to create the database, tables, and indexes.
4.  **Import the Seed Data:**
    *   Using MySQL Workbench's Table Data Import Wizard or `LOAD DATA INFILE` commands, import the generated CSV files from `database/seed_data/` into their respective tables. Follow the relational order (e.g., users and categories first, then products, addresses, orders, etc.).
5.  **Deploy Logic & Test Queries:**
    *   Execute `trigger.sql` to instantiate the stock management triggers.
    *   Execute `stored_procedure.sql` to instantiate the `PlaceOrder` procedure.
    *   Run queries from `queries.sql` to test data retrieval and analytics.
