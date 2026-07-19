import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiCreditCard, FiHash, FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";

import { getOrderById, cancelOrder } from "../services/orderService";
import StatusBadge from "../components/orders/StatusBadge";
import OrderItem from "../components/orders/OrderItem";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await getOrderById(id);
            setOrder(response.order);
            setItems(response.items);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load order.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm("Cancel this order?")) return;
        try {
            setCancelling(true);
            const response = await cancelOrder(id);
            toast.success(response.message);
            fetchOrder();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel order.");
        } finally {
            setCancelling(false);
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });

    const formatPrice = (amount) =>
        Number(amount).toLocaleString("en-IN");

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-6 py-16 text-center text-gray-400">
                Loading order details...
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-5xl mx-auto px-6 py-16 text-center text-gray-500">
                Order not found.
            </div>
        );
    }

    const canCancel = !["Cancelled", "Delivered", "Returned"].includes(order.order_status);

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">

            {/* Back button */}
            <button
                onClick={() => navigate("/orders")}
                className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium mb-6 transition-colors"
            >
                <FiArrowLeft size={16} />
                Back to Orders
            </button>

            {/* Header card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <FiHash size={13} />
                            <span>Order {order.order_id}</span>
                        </div>
                        <p className="text-sm text-gray-500">{formatDate(order.order_date)}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <StatusBadge status={order.order_status} />
                            <StatusBadge status={order.payment_status} />
                        </div>
                    </div>

                    {/* Mini image strip */}
                    <div className="flex items-center gap-2">
                        {items.slice(0, 4).map((item, i) => (
                            <div
                                key={i}
                                className="w-12 h-12 rounded-xl border border-gray-100 bg-teal-50 overflow-hidden flex-shrink-0 flex items-center justify-center"
                            >
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
                                    <FiPackage size={18} className="text-teal-300" />
                                </div>
                            </div>
                        ))}
                        {items.length > 4 && (
                            <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-400">+{items.length - 4}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Left column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Ordered Items */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-base font-bold text-gray-900 mb-2 pb-3 border-b border-gray-50">
                            Ordered Items
                            <span className="ml-2 text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                                {items.length}
                            </span>
                        </h2>
                        {items.map((item) => (
                            <OrderItem
                                key={item.order_item_id || item.product_id}
                                item={item}
                            />
                        ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                                <FiMapPin size={14} className="text-teal-600" />
                            </div>
                            <h2 className="text-base font-bold text-gray-900">Shipping Address</h2>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1 leading-relaxed">
                            <p className="font-medium text-gray-800">{order.address_line1}</p>
                            {order.address_line2 && <p>{order.address_line2}</p>}
                            <p>{order.city}, {order.state} – {order.pincode}</p>
                            <p>{order.country}</p>
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">

                    {/* Payment Summary */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                                <FiCreditCard size={14} className="text-teal-600" />
                            </div>
                            <h2 className="text-base font-bold text-gray-900">Payment</h2>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Method</span>
                                <span className="font-medium text-gray-800">{order.payment_method}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Date</span>
                                <span className="font-medium text-gray-800 text-right text-xs">
                                    {formatDate(order.payment_date)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Transaction ID</span>
                                <span className="font-mono text-xs text-gray-500 text-right break-all max-w-[120px]">
                                    {order.transaction_id}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 mt-5 pt-5 flex justify-between items-center">
                            <span className="font-bold text-gray-900">Total</span>
                            <span className="text-xl font-extrabold text-teal-600">
                                ₹{formatPrice(order.total_amount)}
                            </span>
                        </div>

                        {canCancel && (
                            <button
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                                className="w-full mt-5 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
                            >
                                {cancelling ? "Cancelling..." : "Cancel Order"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;