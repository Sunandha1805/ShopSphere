import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem, clearCart } from "../services/cartService";
import { useCartWishlist } from "../context/CartWishlistContext";
import CartItemCard from "../components/cart/CartItemCard";
import { FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";

const Cart = () => {
    const navigate = useNavigate();
    const { refreshCounts } = useCartWishlist();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await getCart();
            setCart(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load cart.");
        } finally {
            setLoading(false);
        }
    };

    const handleIncrease = async (item) => {
        try {
            await updateCartItem(item.cart_item_id, item.quantity + 1);
            await fetchCart();
            toast.success("Quantity updated");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update quantity");
        }
    };

    const handleDecrease = async (item) => {
        if (item.quantity === 1) return;
        try {
            await updateCartItem(item.cart_item_id, item.quantity - 1);
            await fetchCart();
            toast.success("Quantity updated");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update quantity");
        }
    };

    const handleRemove = async (cartItemId) => {
        try {
            await removeCartItem(cartItemId);
            await fetchCart();
            refreshCounts();
            toast.success("Item removed");
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove item");
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart();
            await fetchCart();
            refreshCounts();
            toast.success("Cart cleared successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to clear cart");
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <FiShoppingCart className="mx-auto text-teal-300 mb-3" size={40} />
                    <p className="text-gray-500 text-sm">Loading your cart…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
                <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center">
                    <FiShoppingCart size={36} className="text-teal-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
                <p className="text-gray-500 text-sm">Looks like you haven't added anything yet.</p>
                <button
                    onClick={() => navigate("/products")}
                    className="mt-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 font-[Inter,sans-serif]">

            {/* Page header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
                    <FiShoppingCart size={18} className="text-white" />
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    My Cart
                    <span className="ml-2 text-sm font-medium text-teal-600 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5 align-middle">
                        {cart.total_items} {cart.total_items === 1 ? "item" : "items"}
                    </span>
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <CartItemCard
                            key={item.cart_item_id}
                            item={item}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                            onRemove={handleRemove}
                        />
                    ))}
                </div>

                {/* Order Summary */}
                <div className="h-fit sticky top-24">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                        <h2 className="text-lg font-bold text-gray-900 mb-5 pb-4 border-b border-gray-100">
                            Order Summary
                        </h2>

                        <div className="space-y-3 mb-5">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Total Items</span>
                                <span className="font-medium text-gray-800">{cart.total_items}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-800">₹{Number(cart.total_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Shipping</span>
                                <span className="text-emerald-600 font-medium">FREE</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-5">
                            <span className="font-bold text-gray-900">Total</span>
                            <span className="text-xl font-extrabold text-teal-600">
                                ₹{Number(cart.total_amount).toLocaleString()}
                            </span>
                        </div>

                        <button
                            onClick={() => navigate("/checkout")}
                            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-3 rounded-xl text-sm tracking-wide transition-all duration-200 shadow-lg shadow-teal-500/25"
                        >
                            Proceed to Checkout
                        </button>

                        <button
                            onClick={handleClearCart}
                            className="w-full mt-3 border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 font-semibold py-2.5 rounded-xl text-sm transition-all duration-200"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Cart;