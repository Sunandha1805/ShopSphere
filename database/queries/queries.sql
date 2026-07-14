use ecommerce_db;

-- 1. Expensive products: Display the product_id, product_name, brand, and price of the 10 most expensive products whose price is greater than ₹5,000.
select product_id, product_name, brand, price
from products
where price > 5000
order by price desc
limit 10;


-- 2. Product search: Find all products whose product name contains the word "USB".
select product_id, product_name, brand, price
from products
where product_name like '%usb%'
order by price;


-- 3. Products with categories: Display each product's name, category name, and price. Sort the result by category name.
select p.product_name, c.category_name, p.price
from products p
join categories c
on p.category_id = c.category_id
order by c.category_name;


-- 4. Complete order details: Display the order ID, customer full name, product name, quantity, price, subtotal, and order status for all orders.
select o.order_id, concat(u.first_name, ' ', u.last_name) as customer_name,
p.product_name, oi.quantity, oi.price, oi.subtotal, o.payment_status
from orders o
join users u 
on o.user_id = u.user_id
join order_items oi
on o.order_id = oi.order_id
join products p
on oi.product_id = p.product_id
order by order_id;


-- 5. Products per category: Display every category along with the total number of products belonging to it. 
-- Categories with zero products should also appear. Sort by the number of products in descending order.
select c.category_name, count(p.product_id) as total_products
from categories c
left join products p 
on c.category_id = p.category_id
group by c.category_name, c.category_id
order by total_products desc;
 
 
-- 6. Overall order statistics: Find the total number of orders, total order value, average order value, minimum order value, and maximum order value.
select count(order_id) as total_orders, round(sum(total_amount), 2) as total_order_value,
round(avg(total_amount), 2) as avg_order_value, min(total_amount) as min_order_value, max(total_amount) as max_order_value
from orders;
 
 
 -- 7. Delivered revenue: Calculate the total revenue generated only from orders whose status is Delivered. 
select round(sum(total_amount), 2) as total_revenue
from orders
where order_status = 'Delivered';


-- 8. Orders by status: Display each order-status and the number of orders having that status. Show the most common status first.
select order_status, count(order_status) as total_orders
from orders
group by order_status
order by total_orders desc;

 
-- 9. Frequent customers: Find customers who have placed more than 10 orders. Display their ID, full name, and total number of orders.
select u.user_id, concat(u.first_name, ' ', u.last_name) as customer_name, count(o.order_id) as total_orders
from users u 
join orders o 
on u.user_id = o.user_id
group by u.user_id
having total_orders > 10 
order by total_orders desc;


-- 10. Best-selling products: Find the top 10 products based on the total quantity sold. Consider only delivered orders.
select p.product_id, p.product_name, sum(oi.quantity) as total_quantity
from products p 
join order_items oi
on p.product_id = oi. product_id
join orders o
on o.order_id = oi.order_id
where o.order_status = 'Delivered'
group by p.product_id, p.product_name
order by total_quantity desc
limit 10;


-- 11. Highest-revenue products: Find the top 10 products that generated the highest revenue from delivered orders.
select p.product_id, p.product_name, round(sum(oi.subtotal), 2) as total_revenue
from products p 
join order_items oi
on p.product_id = oi. product_id
join orders o
on o.order_id = oi.order_id
where o.order_status = 'Delivered'
group by p.product_id, p.product_name
order by total_revenue desc
limit 10;


-- 12. Highest-spending customers: Find the top 10 customers based on the total amount they spent on delivered orders. 
-- Also display their total number of delivered orders.
select u.user_id, concat(u.first_name, ' ', u.last_name) as customer_name,
round(sum(o.total_amount), 2) as total_amount_spent, count(o.order_id) as total_orders
from users u
join orders o 
on u.user_id = o.user_id
where o.order_status = 'delivered'
group by u.user_id
order by total_amount_spent desc
limit 10;


-- 13. Products never ordered: Find all products that have never appeared in any order.
select p.product_id, p.product_name
from products p
left join order_items oi
on p.product_id = oi.product_id
where oi.product_id is null;


-- 14. Users with no orders: Find all users who have never placed an order. Solve this using NOT EXISTS.
select u.user_id, concat(u.last_name, ' ', u.last_name) as user_name
from users u 
left join orders o
on u.user_id  = o.user_id
where o.user_id is null;


select u.user_id, concat(u.last_name, ' ', u.last_name) as user_name
from users u 
where not exists (
select 1
from orders o 
where o.user_id = u.user_id
);


-- 15. Above-average-priced products: Find all products whose price is greater than the average price of all products. Sort them from highest to lowest price.
select product_id, product_name, price
from products 
where price > (
select avg(price)
from products
)
order by price desc;


-- 16. Most expensive product per category: Find the most expensive product in each category. Display the product name, category name, and price.
select p.product_name, c.category_name, p.price
from products p 
join categories c
on p.category_id = c.category_id
where p.price = (
select max(p2.price)
from products p2
where p2.category_id = p.category_id
);


-- 17. Monthly sales report: Generate a monthly report showing the year, month, total number of delivered orders, and total revenue from delivered orders.
select year(order_date) as year, month(order_date) as month, 
count(*) as total_orders, round(sum(total_amount), 2) as total_revenue
from orders
where order_status = 'delivered'
group by year(order_date), month(order_date)
order by year, month;


-- 18. Order value classification: Classify every order into:
-- i. Low Value if the amount is below ₹1,000
-- ii. Medium Value if the amount is ₹1,000 to below ₹10,000
-- iii. High Value if the amount is ₹10,000 or more
select order_id, total_amount,
case 
when total_amount < 1000 then 'Low Value'
when total_amount > 10000 then 'Medium Value'
else 'High value'
end as order_category
from orders;


-- 19. Customer spending using a CTE: Using a CTE, calculate each customer's total number of delivered orders and total spending. 
-- Then display the top 10 highest-spending customers with their names.
with customer_spending as(
select user_id, count(*) as total_orders,
sum(total_amount) as total_spending
from orders
where order_status = 'delivered'
group by user_id
)
select u.user_id, concat(u.first_name, ' ', u.last_name) as customer_name,
cs.total_orders, cs.total_spending
from users u 
join customer_spending cs
on u.user_id = cs.user_id
order by total_spending desc
limit 10;


-- 20. Customer spending rank: Calculate each customer's total spending on delivered orders and assign a rank based on spending using the RANK() window function.
select user_id, round(sum(total_amount), 2) as total_spending, 
rank() over(order by total_spending desc) as spending_rank
from orders
where order_status = 'delivered'
group by user_id;


-- 21. Product price ranking within categories: Rank products from most expensive to least expensive within their own category using DENSE_RANK().
select product_id, category_id, price,
dense_rank() over(partition by category_id order by price desc) rnk
from products;


-- 22. Month-over-month revenue: Calculate monthly revenue from delivered orders. 
-- For each month, also show the previous month's revenue and the difference between the current and previous month's revenue using LAG().
with monthly_revenue as (
select date_format(order_date, '%Y-%m') as month,
sum(total_amount) as revenue
from orders
where order_status = 'delivered'
group by month
) 
select month, round(revenue, 2) as revenue, 
round(lag(revenue) over(order by month), 2) as prev_month_revenue,
round(revenue - lag(revenue) over(order by month), 2) as revenue_change
from monthly_revenue;


-- 23. Product sales view: Create a reusable view named product_sales_summary that displays each product's ID, name, total units sold, and total revenue. 
-- Consider only delivered orders. Then use the view to find the top 10 products by revenue.
create view product_sales_summary as
select p.product_id, p.product_name,
sum(oi.quantity) as units_sold,
round(sum(oi.subtotal), 2) as revenue
from products p
join order_items oi
on p.product_id = oi. product_id
join orders o
on o.order_id = oi.order_id
where o.order_status = 'delivered'
group by p.product_id, p.product_name;

select * from product_sales_summary
order by revenue desc
limit 10;


-- 24. Customer orders stored procedure: Create a stored procedure named GetCustomerOrders that accepts a customer ID as input and 
-- returns all orders placed by that customer, sorted from newest to oldest. 
delimiter //

create procedure GetCustomerOrders(in customer_id int)
begin
select o.order_id, o.order_date, o.order_status, o.total_amount
from orders o
where o.user_id = customer_id
order by o.order_date desc;
end //

delimiter ; 

call GetCustomerOrders(18);


-- 25. Indexing and performance: Analyze the execution plan of a query that searches orders by order_status is delivered. 
-- Then create an index on orders.user_id and compare the execution plan before and after creating the index.

-- BEFORE INDEX
EXPLAIN
SELECT *
FROM orders
WHERE order_status = 'Cancelled';

-- creating index
create index idx_orders_order_status 
on orders(order_status);

-- AFTER INDEX
EXPLAIN
SELECT *
FROM orders
WHERE order_status = 'Cancelled';