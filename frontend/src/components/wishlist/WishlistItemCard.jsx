import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingCart, FiStar } from "react-icons/fi";

const WishlistItemCard = ({ item, onRemove, onMoveToCart }) => {
    const navigate = useNavigate();
    const [removing, setRemoving] = useState(false);
    const [movingToCart, setMovingToCart] = useState(false);

    const handleRemove = async () => {
        setRemoving(true);
        await onRemove(item.wishlist_item_id);
        setRemoving(false);
    };

    const handleMoveToCart = async () => {
        setMovingToCart(true);
        await onMoveToCart(item);
        setMovingToCart(false);
    };

    return (
        <div className="flex gap-5 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">

            {/* Product Image */}
            <div
                className="flex-shrink-0 w-28 h-28 bg-teal-50 rounded-xl flex items-center justify-center overflow-hidden border border-teal-100 cursor-pointer"
                onClick={() => navigate(`/products/${item.product_id}`)}
            >
                <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/200x200?text=No+Image";
                    }}
                />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                    {/* Brand */}
                    <p className="text-[11px] font-semibold text-teal-600 uppercase tracking-wider mb-0.5">
                        {item.brand}
                    </p>

                    {/* Product Name */}
                    <h2
                        className="text-base font-semibold text-gray-900 leading-tight line-clamp-2 cursor-pointer hover:text-teal-700 transition-colors"
                        onClick={() => navigate(`/products/${item.product_id}`)}
                    >
                        {item.product_name}
                    </h2>

                    {/* Price & Discount row */}
                    <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                        <span className="text-lg font-bold text-teal-600">
                            ₹{Number(item.price).toLocaleString()}
                        </span>
                        {Number(item.discount_percent) > 0 && (
                            <span className="text-xs font-semibold text-orange-500">
                                -{parseInt(item.discount_percent)}%
                            </span>
                        )}
                    </div>

                    {/* Rating */}
                    {item.rating && (
                        <div className="flex items-center gap-1 mt-1.5">
                            <FiStar size={12} className="text-amber-400 fill-amber-400" style={{ fill: "#fbbf24" }} />
                            <span className="text-xs font-medium text-gray-600">{item.rating}</span>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <button
                        onClick={handleMoveToCart}
                        disabled={movingToCart}
                        className="flex items-center gap-1.5 px-4 py-2 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 text-xs font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiShoppingCart size={12} />
                        {movingToCart ? "Adding…" : "Move to Cart"}
                    </button>

                    <button
                        onClick={handleRemove}
                        disabled={removing}
                        className="flex items-center gap-1.5 px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 text-xs font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiTrash2 size={12} />
                        {removing ? "Removing…" : "Remove"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WishlistItemCard;