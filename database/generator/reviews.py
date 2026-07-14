import os
import random
import pandas as pd
from faker import Faker

from config import OUTPUT_FOLDER

fake = Faker("en_IN")

REVIEW_TEXTS = [
    "Excellent product!",
    "Worth the money.",
    "Good quality.",
    "Highly recommended.",
    "Average product.",
    "Packaging was good.",
    "Very satisfied with the purchase.",
    "Product arrived on time.",
    "Not as expected.",
    "Fantastic build quality.",
    "Would definitely buy again.",
    "Value for money.",
    "Looks premium.",
    "Works perfectly.",
    "Quality could be better."
]


def generate_reviews():

    orders = pd.read_csv(
        os.path.join(OUTPUT_FOLDER, "orders.csv")
    )

    order_items = pd.read_csv(
        os.path.join(OUTPUT_FOLDER, "order_items.csv")
    )

    reviews = []

    review_id = 1

    # Only delivered orders
    delivered_orders = orders[
        orders["order_status"] == "Delivered"
    ]

    for _, order in delivered_orders.iterrows():

        # 25% chance that a delivered order gets reviewed
        if random.random() > 0.25:
            continue

        items = order_items[
            order_items["order_id"] == order["order_id"]
        ]

        for _, item in items.iterrows():

            rating = random.choices(
                [5,4,3,2,1],
                weights=[45,30,15,7,3],
                k=1
            )[0]

            reviews.append({

                "review_id": review_id,

                "user_id": int(order["user_id"]),

                "product_id": int(item["product_id"]),

                "rating": rating,

                "review_text": random.choice(REVIEW_TEXTS),

                "review_date": fake.date_time_between(
                    start_date=pd.to_datetime(order["delivery_date"]),
                    end_date="now"
                )

            })

            review_id += 1

    reviews_df = pd.DataFrame(reviews)

    reviews_df.to_csv(

        os.path.join(
            OUTPUT_FOLDER,
            "reviews.csv"
        ),

        index=False

    )

    print(f"{len(reviews_df)} reviews generated")


if __name__ == "__main__":
    generate_reviews()