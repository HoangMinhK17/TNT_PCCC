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
        const response = await api.post("/partner/create-partner", partner, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating partner:", error);
        throw error;
    }
};

export const updatePartner = async (id, partner) => {
    try {
        const response = await api.put(`/partner/update-partner/${id}`, partner, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating partner:", error);
        throw error;
    }
};

export const deletePartner = async (id) => {
    try {
        const response = await api.delete(`/partner/delete-partner/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting partner:", error);
        throw error;
    }
};


export const getPartnersForManage = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`/partner/get-partners-for-manage?page=${page}&limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching partners:", error);
        throw error;
    }
};

export const getPartnerByName = async (name, page = 1, limit = 10) => {
    try {
        const response = await api.get(`/partner/get-partner-by-name/${name}?page=${page}&limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching partners:", error);
        throw error;
    }
};


