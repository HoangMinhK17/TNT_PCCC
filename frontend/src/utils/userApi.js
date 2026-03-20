import api from "./api";

export const loginUser = async (email, password) => {
    try {
        const response = await api.post("/user/login-user", { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createUser = async (name, email, password) => {
    try {
        const response = await api.post("/user/create-user", { name, email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const response = await api.get("/user/get-all-users", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateThemeAPI = async (theme) => {
    try {
        const response = await api.put("/user/update-theme", { theme }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAdminThemeAPI = async () => {
    try {
        const response = await api.get("/user/admin-theme");
        return response.data;
    } catch (error) {
        throw error;
    }
};