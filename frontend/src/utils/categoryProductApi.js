import api from "./api";

export const getCategoryProducts = async () => {
    const response = await api.get("/categoryProduct/get-category-products");
    return response.data;
};

export const createCategoryProduct = async (categoryProduct) => {
    const token = localStorage.getItem("token");
    const response = await api.post("/categoryProduct/create-category-product", categoryProduct, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateCategoryProduct = async (id, categoryProduct) => {
    const token = localStorage.getItem("token");
    const response = await api.put(`/categoryProduct/update-category-product/${id}`, categoryProduct, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteCategoryProduct = async (id) => {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/categoryProduct/delete-category-product/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getCategoryProductForManage = async (page, limit) => {
    const token = localStorage.getItem("token");
    const response = await api.get(`/categoryProduct/get-category-product-for-manage?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getCategoryProductBySearch = async (searchTerm, page, limit) => {
    const token = localStorage.getItem("token");
    const response = await api.get(`/categoryProduct/search-category-product/${searchTerm}?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

