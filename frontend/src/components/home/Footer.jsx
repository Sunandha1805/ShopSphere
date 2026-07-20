import { Link } from "react-router-dom";
import {
    FiShoppingBag,
    FiMail,
    FiPhone,
    FiMapPin,
} from "react-icons/fi";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">

            <div className="max-w-7xl mx-auto px-6 py-14">

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Logo */}

                    <div>

                        <div className="flex items-center gap-2 mb-5">

                            <FiShoppingBag
                                size={28}
                                className="text-teal-400"
                            />

                            <h2 className="text-2xl font-bold text-white">
                                ShopSphere
                            </h2>

                        </div>

                        <p className="leading-7">
                            Your one-stop destination for premium electronics,
                            gadgets, and accessories at affordable prices.
                        </p>

                    </div>

                    {/* Quick Links */}

                    <div>

                        <h3 className="text-white font-semibold mb-5">
                            Quick Links
                        </h3>

                        <div className="space-y-3">

                            <Link
                                to="/"
                                className="block hover:text-teal-400"
                            >
                                Home
                            </Link>

                            <Link
                                to="/products"
                                className="block hover:text-teal-400"
                            >
                                Products
                            </Link>

                            <Link
                                to="/orders"
                                className="block hover:text-teal-400"
                            >
                                Orders
                            </Link>

                            <Link
                                to="/wishlist"
                                className="block hover:text-teal-400"
                            >
                                Wishlist
                            </Link>

                        </div>

                    </div>

                    {/* Customer */}

                    <div>

                        <h3 className="text-white font-semibold mb-5">
                            Customer
                        </h3>

                        <div className="space-y-3">

                            <Link
                                to="/cart"
                                className="block hover:text-teal-400"
                            >
                                Cart
                            </Link>

                            <Link
                                to="/addresses"
                                className="block hover:text-teal-400"
                            >
                                Addresses
                            </Link>

                            <Link
                                to="/login"
                                className="block hover:text-teal-400"
                            >
                                Login
                            </Link>

                        </div>

                    </div>

                    {/* Contact */}

                    <div>

                        <h3 className="text-white font-semibold mb-5">
                            Contact
                        </h3>

                        <div className="space-y-4">

                            <div className="flex gap-3">

                                <FiMail className="mt-1" />

                                support@shopsphere.com

                            </div>

                            <div className="flex gap-3">

                                <FiPhone className="mt-1" />

                                +91 98765 43210

                            </div>

                            <div className="flex gap-3">

                                <FiMapPin className="mt-1" />

                                Pune, Maharashtra

                            </div>

                        </div>

                    </div>

                </div>

                <hr className="border-gray-700 my-10" />

                <div className="text-center text-sm text-gray-400">

                    © {new Date().getFullYear()} ShopSphere.
                    All Rights Reserved.

                </div>

            </div>

        </footer>
    );
};

export default Footer;