import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";

import OrderCard from "../components/orders/OrderCard";
import { getOrders } from "../services/orderService";

const Orders = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getOrders();

            setOrders(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>

                <div className="text-center py-20 text-gray-500">
                    Loading orders...
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-10">

                <h1 className="text-3xl font-bold mb-8">
                    My Orders
                </h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">

                    <FiShoppingBag
                        size={70}
                        className="mx-auto text-gray-300"
                    />

                    <h2 className="text-2xl font-semibold mt-6">
                        No Orders Yet
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Looks like you haven't placed any orders yet.
                    </p>

                    <button
                        onClick={() => navigate("/products")}
                        className="mt-8 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        Start Shopping
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-3xl font-bold">
                    My Orders
                </h1>

                <span className="text-gray-500">
                    {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </span>

            </div>

            <div className="space-y-5">

                {orders.map((order) => (
                    <OrderCard
                        key={order.order_id}
                        order={order}
                    />
                ))}

            </div>

        </div>
    );
};

export default Orders;