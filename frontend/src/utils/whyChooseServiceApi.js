import api from "./api";

export const getWhyChooseService = async () => {
    try {
        const response = await api.get("/whyChooseService/get-why");
        return response.data;
    } catch (error) {
        console.error("Error fetching why choose service:", error);
        throw error;
    }
};

export const createWhyChooseService = async (data) => {
    try {
        const response = await api.post("/whyChooseService/create-why", data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating why choose service:", error);
        throw error;
    }
};

export const updateWhyChooseService = async (id, data) => {
    try {
        const response = await api.put(`/whyChooseService/update-why/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating why choose service:", error);
        throw error;
    }
};

export const deleteWhyChooseService = async (id) => {
    try {
        const response = await api.delete(`/whyChooseService/delete-why/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting why choose service:", error);
        throw error;
    }
};

export const getWhyChooseServiceForManage = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`/whyChooseService/get-why-for-manage?page=${page}&limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching why choose service for manage:", error);
        throw error;
    }
};

export const searchWhyChooseService = async (name, page = 1, limit = 10) => {
    try {
        const response = await api.get(`/whyChooseService/search-why?name=${name}&page=${page}&limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error searching why choose service:", error);
        throw error;
    }
};

