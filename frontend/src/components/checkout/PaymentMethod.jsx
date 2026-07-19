import { FiCreditCard, FiSmartphone, FiDollarSign } from "react-icons/fi";

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {
    const methods = [
        { id: "COD", label: "Cash on Delivery", icon: <FiDollarSign size={20} /> },
        { id: "UPI", label: "UPI", icon: <FiSmartphone size={20} /> },
        { id: "CARD", label: "Credit / Debit Card", icon: <FiCreditCard size={20} /> },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                Payment Method
            </h2>

            <div className="space-y-4">
                {methods.map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                        <label
                            key={method.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                isSelected
                                    ? "border-teal-500 bg-teal-50/30"
                                    : "border-gray-100 hover:border-teal-200 hover:bg-gray-50"
                            }`}
                        >
                            <input
                                type="radio"
                                value={method.id}
                                checked={isSelected}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 focus:ring-teal-500 cursor-pointer"
                            />
                            
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isSelected ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-500'}`}>
                                {method.icon}
                            </div>
                            
                            <span className={`font-semibold ${isSelected ? 'text-teal-900' : 'text-gray-700'}`}>
                                {method.label}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default PaymentMethod;