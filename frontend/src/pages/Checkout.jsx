import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AddressCard from "../components/address/AddressCard";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderSummary from "../components/checkout/OrderSummary";

import { getAddresses } from "../services/addressService";
import { getCart } from "../services/cartService";
import { checkout } from "../services/orderService";

const Checkout = () => {
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [cart, setCart] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("COD");

    const [loading, setLoading] = useState(true);
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

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error("Please select a shipping address.");
            return;
        }

        try {
            setPlacingOrder(true);

            const response = await checkout(
                selectedAddress,
                paymentMethod
            );

            toast.success(response.message);

            navigate("/orders");

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to place order."
            );
        } finally {
            setPlacingOrder(false);
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

                        <div className="space-y-4">

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
                    handlePlaceOrder={handlePlaceOrder}
                />

            </div>

        </div>
    );
};

export default Checkout;