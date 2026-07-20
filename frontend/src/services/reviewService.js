import api from "./api";

export const getProductReviews = async (productId) => {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
};

export const createReview = async (productId, { rating, review_text }) => {
    const response = await api.post(`/products/${productId}/reviews`, { rating, review_text });
    return response.data;
};

export const updateReview = async (reviewId, { rating, review_text }) => {
    const response = await api.put(`/reviews/${reviewId}`, { rating, review_text });
    return response.data;
};

export const deleteReview = async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
};
