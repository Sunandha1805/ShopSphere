import api from "./api";

export const getProducts = async (page = 1, limit = 12) => {
    const response = await api.get(`/products?page=${page}&limit=${limit}`);
    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};