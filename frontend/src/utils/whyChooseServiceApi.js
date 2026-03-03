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
        const response = await api.post("/whyChooseService/create-why", data);
        return response.data;
    } catch (error) {
        console.error("Error creating why choose service:", error);
        throw error;
    }
};

export const updateWhyChooseService = async (id, data) => {
    try {
        const response = await api.put(`/whyChooseService/update-why/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating why choose service:", error);
        throw error;
    }
};

export const deleteWhyChooseService = async (id) => {
    try {
        const response = await api.delete(`/whyChooseService/delete-why/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting why choose service:", error);
        throw error;
    }
};
