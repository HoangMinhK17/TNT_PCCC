import api from "./api";

export const getCategoryNews = async () => {
    try {
        const response = await api.get("/categoryNews/get-category-news");
        return response.data;
    } catch (error) {
        console.error("Error fetching category news:", error);
        throw error;
    }
};

export const createCategoryNews = async (categoryNews) => {
    try {
        const response = await api.post("/categoryNews/create-category-news", categoryNews, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating category news:", error);
        throw error;
    }
};

export const updateCategoryNews = async (id, categoryNews) => {
    try {
        const response = await api.put(`/categoryNews/update-category-news/${id}`, categoryNews, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating category news:", error);
        throw error;
    }
};

export const deleteCategoryNews = async (id) => {
    try {
        const response = await api.delete(`/categoryNews/delete-category-news/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting category news:", error);
        throw error;
    }
};

export const getCategoryNewsForManage = async (page, limit) => {
    try {
        const response = await api.get(`/categoryNews/get-category-news-for-manage?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching category news for manage:", error);
        throw error;
    }
};

export const searchCategoryNews = async (name, page, limit) => {
    try {
        const response = await api.get(`/categoryNews/search-category-news/${name}?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error searching category news:", error);
        throw error;
    }
};