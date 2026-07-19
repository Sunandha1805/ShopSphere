import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeWishlistItem, clearWishlist } from "../services/wishlistService";
import { addToCart } from "../services/cartService";
import WishlistItemCard from "../components/wishlist/WishlistItemCard";
import { FiHeart, FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";

const Wishlist = () => {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const data = await getWishlist();
            setWishlist(data.data);
        } catch (error) {
            console.error(error);
            setError("Failed to load wishlist.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (wishlist_item_id) => {
        try {
            await removeWishlistItem(wishlist_item_id);
            await fetchWishlist();
            toast.success("Item removed from wishlist");
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove item");
        }
    };

    const handleMoveToCart = async (item) => {
        try {
            await addToCart(item.product_id);
            await removeWishlistItem(item.wishlist_item_id);
            await fetchWishlist();
            toast.success("Moved to cart!");
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Failed to move item to cart"
            );
        }
    };

    const handleClearWishlist = async () => {
        try {
            await clearWishlist();
            await fetchWishlist();
            toast.success("Wishlist cleared");
        } catch (error) {
            console.error(error);
            toast.error("Failed to clear wishlist");
        }
    };

    /* ── Loading state ── */
    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <FiHeart className="mx-auto text-teal-300 mb-3" size={40} />
                    <p className="text-gray-500 text-sm">Loading your wishlist…</p>
                </div>
            </div>
        );
    }

    /* ── Error state ── */
    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        );
    }

    /* ── Empty state ── */
    if (!wishlist || wishlist.items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
                <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center">
                    <FiHeart size={36} className="text-teal-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Your wishlist is empty</h2>
                <p className="text-gray-500 text-sm">Save items you love and come back to them anytime.</p>
                <button
                    onClick={() => navigate("/products")}
                    className="mt-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    Browse Products
                </button>
            </div>
        );
    }

    const itemCount = wishlist.items.length;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 font-[Inter,sans-serif]">

            {/* Page Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
                        <FiHeart size={18} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        My Wishlist
                        <span className="ml-2 text-sm font-medium text-teal-600 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5 align-middle">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                        </span>
                    </h1>
                </div>

                <button
                    onClick={handleClearWishlist}
                    className="border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-200"
                >
                    Clear Wishlist
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Wishlist Items */}
                <div className="lg:col-span-2 space-y-4">
                    {wishlist.items.map((item) => (
                        <WishlistItemCard
                            key={item.wishlist_item_id}
                            item={item}
                            onRemove={handleRemove}
                            onMoveToCart={handleMoveToCart}
                        />
                    ))}
                </div>

                {/* Summary Panel */}
                <div className="h-fit sticky top-24">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                        <h2 className="text-lg font-bold text-gray-900 mb-5 pb-4 border-b border-gray-100">
                            Wishlist Summary
                        </h2>

                        <div className="space-y-3 mb-5">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Total Items</span>
                                <span className="font-medium text-gray-800">{itemCount}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Total Value</span>
                                <span className="font-medium text-gray-800">
                                    ₹{wishlist.items
                                        .reduce((sum, i) => sum + Number(i.price), 0)
                                        .toLocaleString()}
                                </span>
                            </div>
                        </div>


                        <button
                            onClick={() => navigate("/products")}
                            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-3 rounded-xl text-sm tracking-wide transition-all duration-200 shadow-lg shadow-teal-500/25"
                        >
                            Continue Shopping
                        </button>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Wishlist;