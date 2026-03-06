import api from "./api.js";

export const getInformation = async () => {
    try {
        const response = await api.get("/information/get-information");
        return response.data;
    } catch (error) {
        console.error("Error fetching information:", error);
        throw error;
    }
};

export const getImageInformation = async () => {
    try {
        const response = await api.get("/information/get-image-information");
        return response.data;
    } catch (error) {
        console.error("Error fetching image information:", error);
        throw error;
    }
};

export const getContactInformation = async () => {
    try {
        const response = await api.get("/information/get-contact-information");
        return response.data;
    } catch (error) {
        console.error("Error fetching contact information:", error);
        throw error;
    }
};

export const updateInformation = async (id, data) => {
    try {
        const response = await api.put(`/information/update-information/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating information:", error);
        throw error;
    }
};

export const updateImageInformation = async (id, data) => {
    try {
        const response = await api.put(`/information/update-image-information/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating image information:", error);
        throw error;
    }
};

export const updateContactInformation = async (id, data) => {
    try {
        const response = await api.put(`/information/update-contact-information/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating contact information:", error);
        throw error;
    }
};

export const getAllInformation = async () => {
    try {
        const response = await api.get("/information/get-all-information", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching all information:", error);
        throw error;
    }
};




