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
        const token = localStorage.getItem("token");
        const response = await api.post("/service/createService", serviceData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
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

const updateService = async (id, serviceData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.put(`/service/updateService/${id}`, serviceData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating service:", error);
        throw error;
    }
};

const deleteService = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.delete(`/service/deleteService/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting service:", error);
        throw error;
    }
};

const searchService = async (name, page = 1, limit = 10) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/service/searchService?name=${name}&page=${page}&limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error searching service:", error);
        throw error;
    }
};

const getServicesForManage = async (page = 1, limit = 10) => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/service/getServicesForManage?page=${page}&limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching services for manage:", error);
        throw error;
    }
};

export { getPublicServices, createService, getPublicServiceById, updateService, deleteService, searchService, getServicesForManage };