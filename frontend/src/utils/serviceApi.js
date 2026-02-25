import api from "./api";

const getPublicServices = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`/service/publicService?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching public services:", error);
        throw error;
    }
};

const createService = async (serviceData) => {
    try {
        const response = await api.post("/service/createService", serviceData);
        return response.data;
    } catch (error) {
        console.error("Error creating service:", error);
        throw error;
    }
};

const getPublicServiceById = async (id) => {
    try {
        const response = await api.get(`/service/getPublicServiceById/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching public service by id:", error);
        throw error;
    }
};
export { getPublicServices, createService, getPublicServiceById };