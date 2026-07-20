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

            <div className="max-w-7xl mx-auto px-6 py-8">

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <FiShoppingBag size={28} className="text-teal-400" />
                            <h2 className="text-2xl font-bold text-white">ShopSphere</h2>
                        </div>
                        <p className="leading-7">
                            Your one-stop destination for premium electronics,
                            gadgets, and accessories at affordable prices.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">Quick Links</h3>
                        <div className="space-y-2">
                            <Link to="/" className="block hover:text-teal-400 transition-colors">Home</Link>
                            <Link to="/products" className="block hover:text-teal-400 transition-colors">Products</Link>
                            <Link to="/orders" className="block hover:text-teal-400 transition-colors">Orders</Link>
                            <Link to="/wishlist" className="block hover:text-teal-400 transition-colors">Wishlist</Link>
                        </div>
                    </div>

                    {/* Customer */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">Customer</h3>
                        <div className="space-y-2">
                            <Link to="/cart" className="block hover:text-teal-400 transition-colors">Cart</Link>
                            <Link to="/addresses" className="block hover:text-teal-400 transition-colors">Addresses</Link>
                            <Link to="/profile" className="block hover:text-teal-400 transition-colors">Profile</Link>
                            <Link to="/login" className="block hover:text-teal-400 transition-colors">Login</Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">Contact</h3>
                        <div className="space-y-2">
                            <div className="flex items-start gap-3">
                                <FiMail className="mt-1 flex-shrink-0" />
                                <span>support@shopsphere.com</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <FiPhone className="mt-1 flex-shrink-0" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <FiMapPin className="mt-1 flex-shrink-0" />
                                <span>Pune, Maharashtra</span>
                            </div>
                        </div>
                    </div>

                </div>

                <hr className="border-gray-700 my-6" />

                <div className="text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} ShopSphere. All Rights Reserved.
                </div>

            </div>

        </footer>
    );
};

export default Footer;