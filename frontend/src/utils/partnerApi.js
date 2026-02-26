import api from "./api";

export const getPartners = async () => {
    try {
        const response = await api.get("/partner/get-partners");
        return response.data;
    } catch (error) {
        console.error("Error fetching partners:", error);
        throw error;
    }
};

export const createPartner = async (partner) => {
    try {
        const response = await api.post("/partner/create-partner", partner);
        return response.data;
    } catch (error) {
        console.error("Error creating partner:", error);
        throw error;
    }
};

export const updatePartner = async (id, partner) => {
    try {
        const response = await api.put(`/partner/update-partner/${id}`, partner);
        return response.data;
    } catch (error) {
        console.error("Error updating partner:", error);
        throw error;
    }
};

export const deletePartner = async (id) => {
    try {
        const response = await api.delete(`/partner/delete-partner/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting partner:", error);
        throw error;
    }
};
