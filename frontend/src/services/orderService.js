import api from "./api";

export const checkout = async (address_id, payment_method) => {
    const response = await api.post("/orders/checkout", { address_id, payment_method });
    return response.data;
};
