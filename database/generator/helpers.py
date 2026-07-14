from faker import Faker
import random
import numpy as np
import os

fake = Faker("en_IN")

random.seed(42)
np.random.seed(42)
Faker.seed(42)


def random_date(start, end):
    return fake.date_between(start_date=start, end_date=end)


def random_datetime(start, end):
    return fake.date_time_between(start_date=start, end_date=end)


def ensure_folder(path):
    os.makedirs(path, exist_ok=True)