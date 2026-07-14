import random
import pandas as pd
from faker import Faker
from slugify import slugify

import os
from config import AMAZON_DATASET, PRODUCT_OUTPUT, OUTPUT_FOLDER

fake = Faker("en_IN")

def load_category_mapping():
    mapping = {}
    try:
        csv_path = os.path.join(OUTPUT_FOLDER, "categories.csv")
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            for _, row in df.iterrows():
                mapping[row["category_name"]] = row["category_id"]
    except Exception as e:
        print(f"Warning: Could not load categories.csv - {e}")
    return mapping

CATEGORY_NAME_TO_ID = load_category_mapping()

# Map Amazon dataset category roots to our internal category names
AMAZON_TO_OURS = {
    "Computers&Accessories": "Laptops",
    "Electronics": "Electronics",
    "Home&Kitchen": "Home & Kitchen",
    "OfficeProducts": "Office",
    "MusicalInstruments": "Music",
    "Health&PersonalCare": "Health",
    "HomeImprovement": "Home & Kitchen",
    "Car&Motorbike": "Automotive",
    "Toys&Games": "Toys"
}

def clean_price(price):

    if pd.isna(price):
        return 0

    price = str(price)

    price = price.replace("₹", "")

    price = price.replace(",", "")

    return float(price)


def clean_rating(rating):

    try:

        return float(rating)

    except:

        return round(random.uniform(3.5, 5.0), 1)


def clean_text(text):

    if pd.isna(text):

        return ""

    return str(text).encode("ascii", "ignore").decode("ascii")


def extract_brand(product_name):

    if not product_name:
        return ""

    brand = product_name.split()[0]

    return brand[:100]


def get_category(category):

    root = category.split("|")[0]
    
    our_cat_name = AMAZON_TO_OURS.get(root)
    if our_cat_name and our_cat_name in CATEGORY_NAME_TO_ID:
        return CATEGORY_NAME_TO_ID[our_cat_name]
        
    return CATEGORY_NAME_TO_ID.get(root, 1)


def generate_sku(product_name, product_id):

    slug = slugify(product_name)

    return f"{slug[:10].upper()}-{product_id}"


def generate_products():

    df = pd.read_csv(AMAZON_DATASET)

    rows = []

    for idx, row in df.iterrows():

        pid = idx + 1

        name = clean_text(row["product_name"])

        rows.append({

            "product_id": pid,

            "category_id": get_category(
                row["category"]
            ),

            "product_name": name,

            "brand": extract_brand(name),

            "description": clean_text(row["about_product"]),

            "sku": generate_sku(name, pid),

            "price": clean_price(
                row["discounted_price"]
            ),

            "discount_percent":
                float(
                    str(row["discount_percentage"])
                    .replace("%", "")
                ),

            "stock_quantity":
                random.randint(5, 500),

            "image_url":
                row["img_link"],

            "rating":
                clean_rating(row["rating"]),

            "created_at":
                fake.date_time_between(
                    start_date="-3y",
                    end_date="now"
                )

        })

    products = pd.DataFrame(rows)

    products.to_csv(
        PRODUCT_OUTPUT,
        index=False,
        encoding="utf-8-sig"
    )

    print("products.csv generated")
