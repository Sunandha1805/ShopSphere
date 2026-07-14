import os
import random
import pandas as pd
from faker import Faker

from config import OUTPUT_FOLDER

fake = Faker("en_IN")

PAYMENT_METHODS = {
    "UPI": 45,
    "Credit Card": 20,
    "Debit Card": 15,
    "Wallet": 10,
    "Cash On Delivery": 8,
    "Net Banking": 2
}


def weighted_choice(weight_dict):
    keys = list(weight_dict.keys())
    weights = list(weight_dict.values())

    return random.choices(
        keys,
        weights=weights,
        k=1
    )[0]


def generate_payments():

    orders = pd.read_csv(
        os.path.join(
            OUTPUT_FOLDER,
            "orders.csv"
        )
    )

    payments = []

    payment_id = 1

    for _, order in orders.iterrows():

        status = order["payment_status"]

        payments.append({

            "payment_id": payment_id,

            "order_id": int(order["order_id"]),

            "payment_method": weighted_choice(
                PAYMENT_METHODS
            ),

            "transaction_id":
                f"TXN{100000000 + payment_id}",

            "amount":
                round(float(order["total_amount"]), 2),

            "payment_status": status,

            "payment_date":
                order["order_date"]

        })

        payment_id += 1

    payments_df = pd.DataFrame(payments)

    payments_df.to_csv(
        os.path.join(
            OUTPUT_FOLDER,
            "payments.csv"
        ),
        index=False
    )

    print("payments.csv generated")


if __name__ == "__main__":
    generate_payments()