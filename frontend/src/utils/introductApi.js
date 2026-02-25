import api from "./api";

export const getAllIntroduction = async () => {
    try {
        const response = await api.get("/introduct/get-all");
        return response.data;
    } catch (error) {
        console.error("Error fetching introduction:", error);
        throw error;
    }
};

export const getIntroductionCompany = async () => {
    try {
        const response = await api.get(`/introduct/get-introduct-company`);
        return response.data;
    } catch (error) {
        console.error("Error fetching introduction company:", error);
        throw error;
    }
};



export const getMissionVision = async () => {
    try {
        const response = await api.get(`/introduct/get-mission-vision`);
        return response.data;
    } catch (error) {
        console.error("Error fetching vision:", error);
        throw error;
    }
};

export const getCoreValues = async () => {
    try {
        const response = await api.get(`/introduct/get-core-values`);
        return response.data;
    } catch (error) {
        console.error("Error fetching core values:", error);
        throw error;
    }
};




