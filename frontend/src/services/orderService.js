import api from "./api";

export const checkout = async (address_id, payment_method) => {
    const response = await api.post("/orders/checkout", { address_id, payment_method });
    return response.data;
};

export const getOrders = async () => {
    const response = await api.get("/orders");
    return response.data;
};

export const getOrderById = async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
};

export const cancelOrder = async (orderId) => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
};