import pandas as pd
import os

from config import OUTPUT_FOLDER


class DataContext:

    def __init__(self):

        self.users = None
        self.products = None
        self.categories = None
        self.addresses = None

    def load(self):

        self.users = pd.read_csv(
            os.path.join(
                OUTPUT_FOLDER,
                "users.csv"
            )
        )

        self.products = pd.read_csv(
            os.path.join(
                OUTPUT_FOLDER,
                "products.csv"
            )
        )

        self.categories = pd.read_csv(
            os.path.join(
                OUTPUT_FOLDER,
                "categories.csv"
            )
        )

        self.addresses = pd.read_csv(
            os.path.join(
                OUTPUT_FOLDER,
                "addresses.csv"
            )
        )


context = DataContext()