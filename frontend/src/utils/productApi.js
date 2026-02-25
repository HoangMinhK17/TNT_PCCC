import api from "./api";

export const getPublicProducts = async () => {
    const response = await api.get("/product/getPublicProducts");
    return response.data;
};

export const getPublicProductById = async (id) => {
    const response = await api.get(`/product/getPublicProductById/${id}`);
    return response.data;
};

export const getPublicProductByCategoryId = async (categoryId, page = 1, limit = 10) => {
    const response = await api.get(`/product/getPublicProductByCategoryId/${categoryId}?page=${page}&limit=${limit}`);
    return response.data;
};

export const createProduct = async (product) => {
    const response = await api.post("/product/createProduct", product);
    return response.data;
};

export const updateProduct = async (id, product) => {
    const response = await api.put(`/product/updateProduct/${id}`, product);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/product/deleteProduct/${id}`);
    return response.data;
};

export const getProductByName = async (name, page = 1, limit = 10) => {
    const response = await api.get(`/product/getProductByName/${name}?page=${page}&limit=${limit}`);
    return response.data;
};
