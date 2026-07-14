import os
import argparse
from config import OUTPUT_FOLDER
from categories import generate_categories
from users import generate_users
from products import generate_products
from addresses import generate_addresses
from orders import generate_orders
from payments import generate_payments
from reviews import generate_reviews

def should_generate(filename, flag_passed, global_force, has_specific_flags):
    if flag_passed:
        return True
    if has_specific_flags:
        return False
    if global_force:
        return True
    if os.path.exists(os.path.join(OUTPUT_FOLDER, filename)):
        print(f"{filename} already exists, skipping...")
        return False
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate ShopSphere Dataset")
    parser.add_argument("--force", action="store_true", help="Force regenerate all datasets")
    parser.add_argument("--categories", action="store_true", help="Force regenerate categories")
    parser.add_argument("--users", action="store_true", help="Force regenerate users")
    parser.add_argument("--products", action="store_true", help="Force regenerate products")
    parser.add_argument("--addresses", action="store_true", help="Force regenerate addresses")
    parser.add_argument("--orders", action="store_true", help="Force regenerate orders")
    parser.add_argument("--payments", action="store_true", help="Force regenerate payments")
    parser.add_argument("--reviews", action="store_true", help="Force regenerate reviews")
    args = parser.parse_args()

    specific_flags = any([args.categories, args.users, args.products, args.addresses, args.orders, args.payments, args.reviews])

    print("=" * 40)
    print("Generating ShopSphere Dataset")
    print("=" * 40)

    if should_generate("categories.csv", args.categories, args.force, specific_flags):
        generate_categories()

    if should_generate("users.csv", args.users, args.force, specific_flags):
        generate_users()

    if should_generate("products.csv", args.products, args.force, specific_flags):
        generate_products()

    if should_generate("addresses.csv", args.addresses, args.force, specific_flags):
        generate_addresses()

    if should_generate("orders.csv", args.orders, args.force, specific_flags):
        generate_orders()

    if should_generate("payments.csv", args.payments, args.force, specific_flags):
        generate_payments()

    if should_generate("reviews.csv", args.reviews, args.force, specific_flags):
        generate_reviews()

    print("=" * 40)
    print("Done")
    print("=" * 40)