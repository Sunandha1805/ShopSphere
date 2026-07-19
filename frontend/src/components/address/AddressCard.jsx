import { FiHome, FiBriefcase, FiMapPin, FiEdit2, FiTrash2 } from "react-icons/fi";

const AddressCard = ({
    address,
    selectable = false,
    selectedAddress,
    onSelect,
    onEdit,
    onDelete,
}) => {
    const isSelected = selectable && selectedAddress === address.address_id;

    // Determine icon based on address type
    const getIcon = () => {
        switch (address.address_type?.toLowerCase()) {
            case "home":
                return <FiHome className={isSelected ? "text-teal-600" : "text-gray-500"} size={18} />;
            case "work":
                return <FiBriefcase className={isSelected ? "text-teal-600" : "text-gray-500"} size={18} />;
            default:
                return <FiMapPin className={isSelected ? "text-teal-600" : "text-gray-500"} size={18} />;
        }
    };

    return (
        <div
            className={`relative bg-white border-2 rounded-2xl p-5 ${selectable ? 'cursor-pointer' : ''} transition-all duration-200 shadow-sm hover:shadow-md ${
                isSelected
                    ? "border-teal-500 bg-teal-50/30"
                    : "border-gray-100 hover:border-teal-200"
            }`}
            onClick={() => selectable && onSelect && onSelect(address.address_id)}
        >
            <div className="flex justify-between items-start gap-4">
                
                {/* Left content */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        {/* Radio button (if selection is enabled) */}
                        {selectable && (
                            <input
                                type="radio"
                                checked={isSelected}
                                readOnly
                                className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 focus:ring-teal-500 cursor-pointer"
                            />
                        )}

                        {/* Icon and Type */}
                        <div className="flex items-center gap-2">
                            {getIcon()}
                            <h3 className="font-bold text-gray-900 capitalize tracking-tight">
                                {address.address_type}
                            </h3>
                        </div>

                        {/* Default Badge */}
                        {address.is_default === 1 && (
                            <span className="text-[10px] font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full tracking-wide">
                                DEFAULT
                            </span>
                        )}
                    </div>

                    {/* Address Text */}
                    <div className="text-sm text-gray-600 space-y-1 ml-[calc(1rem+12px)] leading-relaxed">
                        <p className="font-medium text-gray-800">{address.address_line1}</p>
                        {address.address_line2 && <p>{address.address_line2}</p>}
                        <p>
                            {address.city}, {address.state}
                        </p>
                        <p className="font-semibold text-gray-700">
                            {address.pincode} • {address.country}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    {onEdit && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(address);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            aria-label="Edit address"
                        >
                            <FiEdit2 size={16} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(address.address_id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete address"
                        >
                            <FiTrash2 size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddressCard;