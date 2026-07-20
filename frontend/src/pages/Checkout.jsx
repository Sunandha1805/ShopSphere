import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiMapPin, FiCreditCard, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

import AddressCard from "../components/address/AddressCard";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderSummary from "../components/checkout/OrderSummary";
import { useCartWishlist } from "../context/CartWishlistContext";

import { getAddresses } from "../services/addressService";
import { getCart } from "../services/cartService";
import { checkout } from "../services/orderService";

const Checkout = () => {
    const navigate = useNavigate();
    const { refreshCounts } = useCartWishlist();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [cart, setCart] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("COD");

    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);

    useEffect(() => {
        loadCheckoutData();
    }, []);

    const loadCheckoutData = async () => {
        try {
            const [addressResponse, cartResponse] =
                await Promise.all([
                    getAddresses(),
                    getCart(),
                ]);

            setAddresses(addressResponse.data);

            setCart(cartResponse.data);

            const defaultAddress =
                addressResponse.data.find(
                    (address) => address.is_default === 1
                ) || addressResponse.data[0];

            if (defaultAddress) {
                setSelectedAddress(defaultAddress.address_id);
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to load checkout.");
        } finally {
            setLoading(false);
        }
    };

    const handleInitiateOrder = () => {
        if (!selectedAddress) {
            toast.error("Please select a shipping address.");
            return;
        }
        setShowConfirm(true);
    };

    const confirmAndPlaceOrder = async () => {
        if (!selectedAddress) return;

        try {
            setPlacingOrder(true);

            const response = await checkout(
                selectedAddress,
                paymentMethod
            );

            toast.success(response.message);
            refreshCounts();

            navigate("/orders");

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to place order."
            );
        } finally {
            setPlacingOrder(false);
            setShowConfirm(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                Loading checkout...
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold">
                    Your cart is empty
                </h2>

                <button
                    onClick={() => navigate("/products")}
                    className="mt-6 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    const selectedAddressObj = addresses.find(a => a.address_id === selectedAddress);

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">

            <h1 className="text-3xl font-bold mb-8">
                Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Section */}

                <div className="lg:col-span-2 space-y-8">

                    {/* Shipping Address */}

                    <section>

                        <div className="flex justify-between items-center mb-5">

                            <h2 className="text-2xl font-semibold">
                                Shipping Address
                            </h2>

                            <button
                                onClick={() => navigate("/addresses")}
                                className="text-teal-600 hover:underline"
                            >
                                Manage Addresses
                            </button>

                        </div>

                        <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>

                            {addresses.map((address) => (
                                <AddressCard
                                    key={address.address_id}
                                    address={address}
                                    selectable={true}
                                    selectedAddress={selectedAddress}
                                    onSelect={setSelectedAddress}
                                />
                            ))}

                        </div>

                    </section>

                    {/* Payment */}

                    <PaymentMethod
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />

                </div>

                {/* Right Section */}

                <OrderSummary
                    cart={cart}
                    placingOrder={placingOrder}
                    handlePlaceOrder={handleInitiateOrder}
                />

            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">Confirm Your Order</h3>
                            <button onClick={() => setShowConfirm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FiX size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Summary Details */}
                            <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-100">
                                
                                <div className="flex items-start gap-3">
                                    <FiMapPin className="text-teal-600 mt-1 flex-shrink-0" size={18} />
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Shipping To</p>
                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                            {selectedAddressObj?.address_line_1}, {selectedAddressObj?.address_line_2 && `${selectedAddressObj.address_line_2}, `}
                                            {selectedAddressObj?.city}, {selectedAddressObj?.state} - {selectedAddressObj?.postal_code}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 flex items-start gap-3">
                                    <FiCreditCard className="text-teal-600 mt-0.5 flex-shrink-0" size={18} />
                                    <div className="flex-1 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Payment Method</p>
                                            <p className="text-sm text-gray-600 mt-0.5">{paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="border-t border-gray-200 pt-4 flex items-start gap-3">
                                    <FiCheckCircle className="text-teal-600 mt-0.5 flex-shrink-0" size={18} />
                                    <div className="flex-1 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Order Total</p>
                                            <p className="text-sm text-gray-600 mt-0.5">{cart.total_items} items</p>
                                        </div>
                                        <p className="text-lg font-extrabold text-teal-700">₹{Number(cart.total_amount).toLocaleString()}</p>
                                    </div>
                                </div>

                            </div>
                            
                            <p className="text-xs text-gray-500 text-center">
                                By confirming this order, you agree to ShopSphere's Terms of Service and Privacy Policy.
                            </p>
                        </div>
                        
                        <div className="p-6 pt-0 flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={placingOrder}
                                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAndPlaceOrder}
                                disabled={placingOrder}
                                className="flex-1 py-3 px-4 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-lg shadow-teal-500/25 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {placingOrder ? "Processing..." : "Confirm & Pay"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Checkout;