import api from "./api";

export const getCategoryProducts = async () => {
    const response = await api.get("/categoryProduct/get-category-products");
    return response.data;
};

export const createCategoryProduct = async (categoryProduct) => {
    const response = await api.post("/categoryProduct/create-category-product", categoryProduct);
    return response.data;
};

export const updateCategoryProduct = async (id, categoryProduct) => {
    const response = await api.put(`/categoryProduct/update-category-product/${id}`, categoryProduct);
    return response.data;
};

export const deleteCategoryProduct = async (id) => {
    const response = await api.delete(`/categoryProduct/delete-category-product/${id}`);
    return response.data;
};