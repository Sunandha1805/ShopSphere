const FALLBACK_IMG = "https://placehold.co/64x64/f1f5f9/94a3b8?text=?";

import { FiPackage } from "react-icons/fi";

const OrderItem = ({ item }) => {
    const formatPrice = (amount) =>
        Number(amount).toLocaleString("en-IN");

    return (
        <div className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-b-0">
            {/* Product image */}
            <div className="w-16 h-16 rounded-xl border border-gray-100 bg-teal-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                        }}
                    />
                ) : null}
                <div
                    className="w-full h-full items-center justify-center"
                    style={{ display: item.image_url ? "none" : "flex" }}
                >
                    <FiPackage size={22} className="text-teal-300" />
                </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.product_name}</h3>
                {item.brand && (
                    <p className="text-xs text-gray-400 mt-0.5">{item.brand}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                    ₹{formatPrice(item.price)} × {item.quantity}
                </p>
            </div>

            {/* Subtotal */}
            <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900 text-base">₹{formatPrice(item.subtotal)}</p>
            </div>
        </div>
    );
};

export default OrderItem;