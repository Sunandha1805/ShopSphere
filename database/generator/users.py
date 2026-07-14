import pandas as pd
import random
import os
import bcrypt

from faker import Faker

from helpers import fake
from config import NUM_USERS, OUTPUT_FOLDER

fake = Faker("en_IN")

def hash_password(password):
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(rounds=4)
    ).decode("utf-8")

def generate_users():

    rows = []

    genders = ["Male", "Female", "Other"]

    status = ["Active", "Inactive", "Blocked"]

    for i in range(1, NUM_USERS + 1):

        first = fake.first_name()

        last = fake.last_name()

        rows.append({

            "user_id": i,

            "first_name": first,

            "last_name": last,

            "email": f"{first.lower()}.{last.lower()}{i}@gmail.com",

            "password_hash": hash_password("Password@123"),

            "phone": fake.msisdn()[:10],

            "gender": random.choice(genders),

            "date_of_birth": fake.date_of_birth(minimum_age=18, maximum_age=60),

            "account_status": random.choices(
                status,
                weights=[90, 8, 2]
            )[0],

            "created_at": fake.date_time_between("-5y", "now"),

            "updated_at": fake.date_time_between("-1y", "now"),

            "last_login": fake.date_time_between("-30d", "now")

        })

    df = pd.DataFrame(rows)

    df.to_csv(
        os.path.join(OUTPUT_FOLDER, "users.csv"),
        index=False
    )

    print("users.csv generated")