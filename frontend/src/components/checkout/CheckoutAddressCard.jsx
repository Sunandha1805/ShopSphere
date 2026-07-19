const CheckoutAddressCard = ({
    address,
    selectedAddress,
    onSelect,
}) => {
    return (
        <div
            onClick={() => onSelect(address.address_id)}
            className={`border rounded-xl p-5 cursor-pointer transition ${
                selectedAddress === address.address_id
                    ? "border-teal-600 bg-teal-50"
                    : "border-gray-300"
            }`}
        >
            <div className="flex gap-3">

                <input
                    type="radio"
                    checked={
                        selectedAddress ===
                        address.address_id
                    }
                    readOnly
                />

                <div>

                    <h3 className="font-semibold">
                        {address.address_type}
                    </h3>

                    <p>{address.address_line1}</p>

                    {address.address_line2 && (
                        <p>{address.address_line2}</p>
                    )}

                    <p>
                        {address.city}, {address.state}
                    </p>

                    <p>
                        {address.pincode}, {address.country}
                    </p>

                </div>

            </div>
        </div>
    );
};

export default CheckoutAddressCard;