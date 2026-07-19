import api from "./api";

export const getWishlist = async () => {
    const response = await api.get("/wishlist");
    return response.data;
};

export const addToWishlist = async (product_id) => {
    const response = await api.post("/wishlist/items", {
        product_id
    });

    return response.data;
};

export const removeWishlistItem = async (wishlist_item_id) => {
    const response = await api.delete(`/wishlist/items/${wishlist_item_id}`);

    return response.data;
};

export const clearWishlist = async () => {
    const response = await api.delete("/wishlist");

    return response.data;
};