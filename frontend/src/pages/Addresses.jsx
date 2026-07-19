import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AddressCard from "../components/address/AddressCard";
import AddressForm from "../components/address/AddressForm";

import {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
} from "../services/addressService";

const Addresses = () => {

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {

            const response = await getAddresses();

            setAddresses(response.data);

        } catch (error) {

            console.error(error);
            toast.error("Failed to load addresses");

        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (formData) => {
        try {
            setSaving(true);
            await addAddress(formData);
            toast.success("Address added");
            setShowForm(false);
            fetchAddresses();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add address");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateAddress = async (formData) => {
        try {
            setSaving(true);
            await updateAddress(editingAddress.address_id, formData);
            toast.success("Address updated");
            setShowForm(false);
            setEditingAddress(null);
            fetchAddresses();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update address");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;
        try {
            await deleteAddress(id);
            toast.success("Address deleted!");
            fetchAddresses();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete address");
        }
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setShowForm(true);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-gray-500 text-sm">Loading addresses…</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 font-[Inter,sans-serif]">
            
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    My Addresses
                </h1>
                {!showForm && (
                    <button
                        onClick={() => {
                            setEditingAddress(null);
                            setShowForm(true);
                        }}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
                    >
                        + Add New Address
                    </button>
                )}
            </div>

            {showForm && (
                <div className="mb-10 max-w-2xl">
                    <AddressForm
                        initialData={editingAddress}
                        onSubmit={(formData) => {
                            if (editingAddress) {
                                handleUpdateAddress(formData);
                            } else {
                                handleAddAddress(formData);
                            }
                        }}
                        loading={saving}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingAddress(null);
                        }}
                    />
                </div>
            )}

            {!showForm && (
                addresses.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">No addresses found</h2>
                        <p className="text-gray-500 text-sm">You haven't saved any addresses yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((address) => (
                            <AddressCard
                                key={address.address_id}
                                address={address}
                                selectable={false}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default Addresses;