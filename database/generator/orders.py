import os
import random
from datetime import timedelta

import pandas as pd
from faker import Faker

from config import OUTPUT_FOLDER
from data_context import context

fake = Faker("en_IN")

# -----------------------------
# Order Status Distribution
# -----------------------------

ORDER_STATUS = {
    "Delivered": 72,
    "Shipped": 10,
    "Packed": 5,
    "Confirmed": 4,
    "Pending": 4,
    "Cancelled": 3,
    "Returned": 2
}

# -----------------------------
# Payment Methods
# -----------------------------

PAYMENT_METHODS = {
    "UPI": 45,
    "Credit Card": 20,
    "Debit Card": 15,
    "Wallet": 10,
    "Cash On Delivery": 8,
    "Net Banking": 2
}

# -----------------------------
# Products Per Order
# -----------------------------

PRODUCTS_PER_ORDER = {
    1:45,
    2:30,
    3:15,
    4:7,
    5:3
}

# --------------------------------
# Build product weights
# --------------------------------

def build_product_weights(products):

    weights = []

    for _, row in products.iterrows():

        weight = 10

        category = int(row["category_id"])

        price = float(row["price"])

        # Category weights

        if category == 1:
            weight += 40

        elif category == 2:
            weight += 35

        elif category == 3:
            weight += 30

        elif category == 4:
            weight += 25

        elif category == 5:
            weight += 20

        # Price weights

        if price < 500:
            weight += 40

        elif price < 2000:
            weight += 25

        elif price < 10000:
            weight += 10

        elif price < 50000:
            weight += 5

        else:
            weight += 1

        weights.append(weight)

    return weights

# ---------------------------
# Helper Functions
# ---------------------------

def weighted_choice(weight_dict):

    keys = list(weight_dict.keys())

    weights = list(weight_dict.values())

    return random.choices(
        keys,
        weights=weights,
        k=1
    )[0]


def payment_status(order_status):

    if order_status == "Delivered":
        return "Paid"

    if order_status == "Returned":
        return "Refunded"

    if order_status == "Cancelled":
        return "Refunded"

    if order_status == "Pending":
        return "Pending"

    return "Paid"


def delivery_date(order_date, status):

    if status == "Delivered":
        return order_date + timedelta(days=random.randint(3,7))

    return None

# ---------------------------
# Load Context
# ---------------------------

context.load()

users = context.users

products = context.products

addresses = context.addresses

#-------------------------
# Build product weights
#-------------------------

PRODUCT_WEIGHTS = build_product_weights(
    products
)

# ---------------

from config import NUM_ORDERS

def generate_orders():

    orders = []
    order_items = []
    order_item_id = 1

    print("Sampling users for orders...")
    selected_users = users.sample(
        n=NUM_ORDERS,
        replace=True
    )

    for order_id, (_, user) in enumerate(selected_users.iterrows(), start=1):
        user_id = int(user["user_id"])

        # Get addresses of that user
        user_addresses = addresses[
            addresses["user_id"] == user_id
        ]

        if user_addresses.empty:
            continue

        address = user_addresses.sample(1).iloc[0]

        order_date = fake.date_time_between(
            start_date="-3y",
            end_date="now"
        )

        status = weighted_choice(ORDER_STATUS)
        
        # Generate order items
        num_items = weighted_choice(PRODUCTS_PER_ORDER)
        
        # Make sure not to sample more products than exist
        num_items = min(num_items, len(products))
        
        selected_products = products.sample(
            n=num_items,
            weights=PRODUCT_WEIGHTS,
            replace=False
        )
        
        total_amount = 0
        
        for _, product in selected_products.iterrows():
            quantity = random.choices([1, 2, 3, 4, 5], weights=[70, 15, 8, 5, 2], k=1)[0]
            unit_price = round(float(product["price"]), 2)
            subtotal = round(quantity * unit_price, 2)
            total_amount += subtotal
            
            order_items.append({
                "order_item_id": order_item_id,
                "order_id": order_id,
                "product_id": int(product["product_id"]),
                "quantity": quantity,
                "price": round(unit_price, 2),
                "subtotal": round(subtotal, 2)
            })
            
            order_item_id += 1

        orders.append({

            "order_id": order_id,

            "user_id": user_id,

            "address_id": int(address["address_id"]),

            "order_date": order_date,

            "order_status": status,

            "payment_status": payment_status(status),

            "total_amount": round(total_amount, 2),

            "delivery_date": delivery_date(
                order_date,
                status
            )

        })

    orders_df = pd.DataFrame(orders)
    orders_df.to_csv(
        os.path.join(
            OUTPUT_FOLDER,
            "orders.csv"
        ),
        index=False
    )
    
    order_items_df = pd.DataFrame(order_items)
    order_items_df.to_csv(
        os.path.join(
            OUTPUT_FOLDER,
            "order_items.csv"
        ),
        index=False
    )

    print(f"{len(orders_df)} orders generated")
    print(f"{len(order_items_df)} order items generated")


if __name__ == "__main__":
    generate_orders()