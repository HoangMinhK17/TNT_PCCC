import api from "./api";

export const getAllIntroduction = async () => {
    const response = await api.get("/introduct/get-all");
    return response.data;
};

export const getIntroductionCompany = async () => {
    const response = await api.get("/introduct/get-introduct-company");
    return response.data;
};

export const getMissionVision = async () => {
    const response = await api.get("/introduct/get-mission-vision");
    return response.data;
};

export const getCoreValues = async () => {
    const response = await api.get("/introduct/get-core-values");
    return response.data;
};

export const getIntroductionCompanyById = async (id) => {
    const response = await api.get(`/introduct/get-introduct-company-by-id/${id}`);
    return response.data;
};

export const updateIntroductionCompany = async (id, data) => {
    const token = localStorage.getItem("token");
    const response = await api.put(`/introduct/update-introduct-company/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateMissionVision = async (id, data) => {
    const token = localStorage.getItem("token");
    const response = await api.put(`/introduct/update-mission-vision/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const addCoreValues = async (data) => {
    const token = localStorage.getItem("token");
    const response = await api.post("/introduct/add-core-values-company", data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const deleteCoreValues = async (id) => {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/introduct/delete-core-values-company/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateCoreValues = async (id, data) => {
    const token = localStorage.getItem("token");
    const response = await api.put(`/introduct/update-core-values-company/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

