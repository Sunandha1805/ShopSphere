-- INSERT trigger : check if stock is available
delimiter //

create trigger check_product_stock
before insert on order_items
for each row 
begin
declare available_stock int;

select stock_quantity
into available_stock
from products
where product_id = new.product_id;

if available_stock < new.quantity then
signal sqlstate '45000'
set message_text = 'Insufficient Product Stock';
end if;
end //

delimiter ;

-- INSERT trigger : update stock
delimiter //

create trigger reduce_stock_quantity
after insert on order_items
for each row
begin
update products
set stock_quantity = stock_quantity - new.quantity
where product_id = new.product_id;
end//

delimiter ;

-- UPDATE trigger: adjust stock when order quantity changes
DELIMITER //

CREATE TRIGGER update_stock_quantity
AFTER UPDATE ON order_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock_quantity =
        stock_quantity + OLD.quantity - NEW.quantity
    WHERE product_id = NEW.product_id;
END //

DELIMITER ;

-- UPDATE trigger: to validate that enough additional stock exists before increasing the quantity.
DELIMITER //

CREATE TRIGGER check_stock_before_update
BEFORE UPDATE ON order_items
FOR EACH ROW
BEGIN
    DECLARE available_stock INT;
    DECLARE additional_quantity INT;

    SET additional_quantity = NEW.quantity - OLD.quantity;

    IF additional_quantity > 0 THEN

        SELECT stock_quantity
        INTO available_stock
        FROM products
        WHERE product_id = NEW.product_id;

        IF available_stock < additional_quantity THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Insufficient Product Stock';
        END IF;

    END IF;
END //

DELIMITER ;

-- DELETE trigger: restore stock when an order item is deleted
DELIMITER //

CREATE TRIGGER restore_stock_quantity
AFTER DELETE ON order_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock_quantity = stock_quantity + OLD.quantity
    WHERE product_id = OLD.product_id;
END //

DELIMITER ;

