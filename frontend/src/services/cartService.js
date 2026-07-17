import api from "./api";

export const getCart = async () => {
    const response = await api.get("/cart");
    return response.data;
};

export const addToCart = async (product_id, quantity = 1) => {
    const response = await api.post("/cart/items", {
        product_id,
        quantity
    });
    return response.data;
};

export const updateCartItem = async (cart_item_id, quantity) => {
    const response = await api.put(`/cart/items/${cart_item_id}`, {
        quantity
    });
    return response.data;
};

export const removeCartItem = async (cart_item_id) => {
    const response = await api.delete(`/cart/items/${cart_item_id}`);
    return response.data;
};

export const clearCart = async () => {
    const response = await api.delete("/cart");
    return response.data;
};