import api from "./api";

export const getNews = async () => {
    try {
        const response = await api.get("/news/get-news");
        return response.data;
    } catch (error) {
        console.error("Error fetching news:", error);
        throw error;
    }
};

export const createNews = async (news) => {
    try {
        const response = await api.post("/news/create-news", news);
        return response.data;
    } catch (error) {
        console.error("Error creating news:", error);
        throw error;
    }
};

export const updateNews = async (id, news) => {
    try {
        const response = await api.put(`/news/update-news/${id}`, news);
        return response.data;
    } catch (error) {
        console.error("Error updating news:", error);
        throw error;
    }
};

export const deleteNews = async (id) => {
    try {
        const response = await api.delete(`/news/delete-news/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting news:", error);
        throw error;
    }
};

export const getNewsById = async (id) => {
    try {
        const response = await api.get(`/news/get-news-by-id/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching news by id:", error);
        throw error;
    }
};

export const getNewsByCategoryId = async (categoryNewsId, page = 1, limit = 10) => {
    try {
        const response = await api.get(`/news/get-news-by-category-id/${categoryNewsId}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching news by category id:", error);
        throw error;
    }
};

export const getNewsBySearch = async (searchTerm, page = 1, limit = 10) => {
    try {
        const response = await api.get(`/news/get-news-by-search/${searchTerm}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching news by search:", error);
        throw error;
    }
};
