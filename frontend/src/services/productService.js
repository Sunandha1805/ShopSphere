import api from "./api";

export const getProducts = async (page = 1, limit = 12, category = "", search = "") => {
    const params = new URLSearchParams({ page, limit });
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};