import { useState, useEffect } from "react";
import { FiSave, FiX } from "react-icons/fi";

const AddressForm = ({ initialData, onSubmit, onCancel, loading }) => {
    const defaultForm = {
        address_type: "Home",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        is_default: 0,
    };

    const [formData, setFormData] = useState(defaultForm);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(defaultForm);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                {initialData ? "Edit Address" : "Add New Address"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                    <select
                        name="address_type"
                        value={formData.address_type}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                        required
                    >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                    <input
                        type="text"
                        name="address_line1"
                        value={formData.address_line1}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                        placeholder="House No, Building, Street, Area"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                    <input
                        type="text"
                        name="address_line2"
                        value={formData.address_line2 || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                        placeholder="Locality / Landmark"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                        required
                    />
                </div>

                <div className="md:col-span-2 mt-2 flex items-center">
                    <input
                        type="checkbox"
                        id="is_default"
                        name="is_default"
                        checked={formData.is_default === 1}
                        onChange={handleChange}
                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                    />
                    <label htmlFor="is_default" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                        Make this my default address
                    </label>
                </div>
            </div>

            <div className="flex gap-3 mt-8 pt-5 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <FiSave size={16} />
                    {loading ? "Saving..." : initialData ? "Update Address" : "Save Address"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                    <FiX size={16} />
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default AddressForm;
