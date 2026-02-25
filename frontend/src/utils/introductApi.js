import api from "./api";

export const getIntroduction = async () => {
    try {
        const response = await api.get("/introduct/get-all");
        return response.data;
    } catch (error) {
        console.error("Error fetching introduction:", error);
        throw error;
    }
};


