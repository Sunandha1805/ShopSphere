import { FiCreditCard } from "react-icons/fi";

const OrderSummary = ({ cart, placingOrder, handlePlaceOrder }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                Order Summary
            </h2>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Total Items</span>
                    <span className="font-medium text-gray-800">{cart.total_items}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded text-xs tracking-wide">
                        FREE
                    </span>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center text-xl font-extrabold text-gray-900">
                    <span>Total</span>
                    <span>₹{Number(cart.total_amount).toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">Inclusive of all taxes</p>
            </div>

            <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {placingOrder ? (
                    "Processing..."
                ) : (
                    <>
                        <FiCreditCard size={18} />
                        Place Order
                    </>
                )}
            </button>
        </div>
    );
};

export default OrderSummary;