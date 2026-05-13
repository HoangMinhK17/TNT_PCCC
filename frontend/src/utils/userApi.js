import api from "./api";

export const loginUser = async (email, password) => {
    try {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = crypto.randomUUID ? crypto.randomUUID() : 'device-' + Math.random().toString(36).substring(2, 15) + Date.now();
            localStorage.setItem('deviceId', deviceId);
        }
        const response = await api.post("/user/login-user", { email, password, deviceId });
        if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createUser = async (name, email, password) => {
    try {
        const response = await api.post("/user/create-user", { name, email, password }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
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
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await api.get("/user/admin-theme", { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const changePasswordAPI = async (password, newPassword) => {
    try {
        const response = await api.put("/user/change-password", { password, newPassword }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateInfoAPI = async (name) => {
    try {
        const response = await api.put("/user/update-info", { name }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const forgotPasswordAPI = async (email) => {
    try {
        const response = await api.post("/user/forgot-password", { email }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPasswordAPI = async (token, newPassword) => {
    try {
        const response = await api.post("/user/reset-password", { token, newPassword }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllSessionsAPI = async ({ page = 1, pageSize = 20, isActive = '', search = '' } = {}) => {
    try {
        const params = { page, pageSize };
        if (isActive !== '') params.isActive = isActive;
        if (search) params.search = search;
        const response = await api.get("/user/sessions", {
            params,
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logoutSessionAPI = async (sessionId) => {
    try {
        const response = await api.put(`/user/sessions/${sessionId}/logout`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteSessionAPI = async (sessionId) => {
    try {
        const response = await api.delete(`/user/sessions/delete/${sessionId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
