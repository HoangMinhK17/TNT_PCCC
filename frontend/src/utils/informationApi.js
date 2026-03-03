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

