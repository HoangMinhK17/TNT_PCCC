import api from "./api";

export const getAllHeader = async () => {
    try {
        const response = await api.get("/header/get-all-header");
        return response.data;
    } catch (error) {
        console.error("Error fetching headers:", error);
        throw error;
    }
}

export const getAllHeaderForManagement = async (page, limit) => {
    try {
        const response = await api.get(`/header/get-all-header-for-management?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching headers:", error);
        throw error;
    }
}

export const updateHeader = async (id, data) => {
    try {
        const response = await api.put(`/header/update-header/${id}`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating header:", error);
        throw error;
    }
}

export const findHeaderByName = async (name, page, limit) => {
    try {
        const response = await api.get(`/header/find-header-by-name/${name}?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching headers:", error);
        throw error;
    }
}



