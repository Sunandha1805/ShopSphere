const CartItemCard = ({ item, onIncrease, onDecrease, onRemove }) => {
    return (
        <div className="flex gap-5 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">

            {/* Product Image */}
            <div className="flex-shrink-0 w-28 h-28 bg-teal-50 rounded-xl flex items-center justify-center overflow-hidden border border-teal-100">
                <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/200x200?text=No+Image";
                    }}
                />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                    <h2 className="text-base font-semibold text-gray-900 leading-tight truncate">
                        {item.product_name}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {item.brand}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-teal-600">
                            ₹{Number(item.price).toLocaleString()}
                        </span>
                        {Number(item.discount_percent) > 0 && (
                            <span className="text-xs font-semibold text-orange-500">
                                -{parseInt(item.discount_percent)}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Bottom row: quantity + subtotal + remove */}
                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onDecrease(item)}
                            disabled={item.quantity === 1}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-teal-100 hover:text-teal-700 text-gray-600 font-bold text-lg transition-colors flex items-center justify-center leading-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:text-gray-600"
                        >
                            −
                        </button>
                        <span className="w-6 text-center font-semibold text-gray-800 text-sm">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => onIncrease(item)}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-teal-100 hover:text-teal-700 text-gray-600 font-bold text-lg transition-colors flex items-center justify-center leading-none"
                        >
                            +
                        </button>
                    </div>

                    {/* Subtotal */}
                    <span className="text-sm font-semibold text-gray-700">
                        ₹{Number(item.subtotal).toLocaleString()}
                    </span>

                    {/* Remove */}
                    <button
                        onClick={() => onRemove(item.cart_item_id)}
                        className="text-xs font-medium text-red-400 hover:text-red-600 hover:underline transition-colors"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItemCard;