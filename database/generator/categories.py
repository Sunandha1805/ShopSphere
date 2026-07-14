import pandas as pd
import os
from config import OUTPUT_FOLDER
from helpers import ensure_folder

categories = [
    ("Electronics", "Electronic gadgets"),
    ("Mobiles", "Smartphones and accessories"),
    ("Laptops", "Laptops and notebooks"),
    ("Fashion", "Clothing and apparel"),
    ("Books", "Books and magazines"),
    ("Home & Kitchen", "Home essentials"),
    ("Furniture", "Furniture"),
    ("Sports", "Sports products"),
    ("Beauty", "Beauty products"),
    ("Toys", "Kids toys"),
    ("Gaming", "Gaming accessories"),
    ("Groceries", "Daily groceries"),
    ("Automotive", "Vehicle accessories"),
    ("Jewellery", "Jewellery"),
    ("Pet Supplies", "Pet products"),
    ("Music", "Music instruments"),
    ("Office", "Office supplies"),
    ("Health", "Healthcare"),
    ("Baby Products", "Baby care"),
    ("Accessories", "General accessories")
]


def generate_categories():

    ensure_folder(OUTPUT_FOLDER)

    rows = []

    for i, (name, desc) in enumerate(categories, start=1):

        rows.append({
            "category_id": i,
            "category_name": name,
            "description": desc
        })

    df = pd.DataFrame(rows)

    df.to_csv(
        os.path.join(OUTPUT_FOLDER, "categories.csv"),
        index=False
    )

    print("categories.csv generated")