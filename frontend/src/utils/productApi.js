import api from "./api";

export const getPublicProducts = async () => {
    const response = await api.get("/product/getPublicProducts");
    return response.data;
};

export const getProductForManage = async (params = {}) => {
    const token = localStorage.getItem("token");
    // Clean params: remove null, undefined, or empty strings
    const cleanedParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== "" && v !== "null" && v !== "undefined")
    );
    const query = new URLSearchParams(cleanedParams).toString();
    const response = await api.get(`/product/getProductForManage?${query}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
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
    const token = localStorage.getItem("token");
    const response = await api.post("/product/createProduct", product, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateProduct = async (id, product) => {
    const token = localStorage.getItem("token");
    const response = await api.put(`/product/updateProduct/${id}`, product, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/product/deleteProduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getProductByName = async (name, page = 1, limit = 10) => {
    const response = await api.get(`/product/getProductByName/${name}?page=${page}&limit=${limit}`);
    return response.data;
};

export const getProductByCategoryIdForManage = async (categoryId, page = 1, limit = 10) => {
    const token = localStorage.getItem("token");
    const response = await api.get(`/product/getProductByCategoryIdForManage/${categoryId}?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getProductByNameForManage = async (name, page = 1, limit = 10) => {
    const token = localStorage.getItem("token");
    const response = await api.get(`/product/getProductByNameForManage/${name}?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
