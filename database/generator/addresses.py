import random
import os

import pandas as pd

from faker import Faker

from config import (
    NUM_ADDRESSES,
    OUTPUT_FOLDER
)

from data_context import context

fake = Faker("en_IN")


def generate_addresses():

    context.load()

    users = context.users

    rows = []

    address_types = [
        "Home",
        "Office",
        "Other"
    ]

    aid = 1

    # 1. Generate one default address for every user
    for _, user in users.iterrows():
        rows.append({
            "address_id": aid,
            "user_id": int(user.user_id),
            "address_type": random.choice(address_types),
            "address_line1": fake.building_number() + ", " + fake.street_name(),
            "address_line2": "",
            "city": fake.city(),
            "state": fake.state(),
            "country": "India",
            "pincode": fake.postcode(),
            "is_default": True
        })
        aid += 1

    # 2. Generate remaining additional addresses for randomly selected users
    remaining_addresses = NUM_ADDRESSES - len(users)
    if remaining_addresses > 0:
        for _ in range(remaining_addresses):
            user = users.sample(1).iloc[0]
            rows.append({
                "address_id": aid,
                "user_id": int(user.user_id),
                "address_type": random.choice(address_types),
                "address_line1": fake.building_number() + ", " + fake.street_name(),
                "address_line2": "",
                "city": fake.city(),
                "state": fake.state(),
                "country": "India",
                "pincode": fake.postcode(),
                "is_default": False
            })
            aid += 1

    df = pd.DataFrame(rows)

    df.to_csv(

        os.path.join(
            OUTPUT_FOLDER,
            "addresses.csv"
        ),

        index=False

    )

    print("addresses.csv generated")