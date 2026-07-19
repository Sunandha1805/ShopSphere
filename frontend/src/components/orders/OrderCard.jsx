import { FiChevronRight, FiPackage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const ProductThumbnail = ({ src, alt }) => (
    <div className="w-14 h-14 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center">
        {src ? (
            <img
                src={src}
                alt={alt || "Product"}
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                }}
            />
        ) : null}
        <div
            className="w-full h-full items-center justify-center bg-teal-50"
            style={{ display: src ? "none" : "flex" }}
        >
            <FiPackage size={20} className="text-teal-300" />
        </div>
    </div>
);

const OrderCard = ({ order }) => {
    const navigate = useNavigate();

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
        });

    const formatPrice = (amount) =>
        Number(amount).toLocaleString("en-IN");

    const extraItems = order.item_count - 2;

    return (
        <div
            onClick={() => navigate(`/orders/${order.order_id}`)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-teal-200 transition-all duration-200 group"
        >
            {/* Top row: thumbnails + status + arrow */}
            <div className="flex items-center gap-4">
                {/* Product thumbnails */}
                <div className="flex items-center gap-2">
                    {order.preview_image_1 && (
                        <ProductThumbnail src={order.preview_image_1} alt="Product 1" />
                    )}
                    {order.preview_image_2 && (
                        <ProductThumbnail src={order.preview_image_2} alt="Product 2" />
                    )}
                    {extraItems > 0 && (
                        <div className="w-14 h-14 rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-500">+{extraItems}</span>
                        </div>
                    )}
                    {!order.preview_image_1 && (
                        <ProductThumbnail src={null} alt="Product" />
                    )}
                </div>

                {/* Meta info */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">{formatDate(order.order_date)}</p>
                    <div className="flex flex-wrap gap-1.5">
                        <StatusBadge status={order.order_status} />
                        <StatusBadge status={order.payment_status} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        {order.item_count} {order.item_count === 1 ? "item" : "items"}
                    </p>
                </div>

                {/* Price + arrow */}
                <div className="text-right flex-shrink-0 flex items-center gap-2">
                    <span className="text-lg font-extrabold text-gray-900">
                        ₹{formatPrice(order.total_amount)}
                    </span>
                    <FiChevronRight
                        size={18}
                        className="text-gray-300 group-hover:text-teal-500 transition-colors"
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderCard;