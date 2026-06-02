import api from "./api";

export const loginUser = async (email, password) => {
    try {
        // Mỗi tài khoản có deviceId riêng biệt theo email
        // Tránh tình trạng hai tài khoản khác nhau trên cùng trình duyệt dùng chung deviceId
        const deviceKey = `deviceId_${email}`;
        let deviceId = localStorage.getItem(deviceKey);
        if (!deviceId) {
            deviceId = crypto.randomUUID ? crypto.randomUUID() : 'device-' + Math.random().toString(36).substring(2, 15) + Date.now();
            localStorage.setItem(deviceKey, deviceId);
        }
        // Lưu deviceId hiện tại (của account đang đăng nhập) để socket dùng
        localStorage.setItem('deviceId', deviceId);
        const response = await api.post("/user/login-user", { email, password, deviceId });
        if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createUser = async (name, email, role) => {
    try {
        const response = await api.post("/user/create-user", { name, email, role }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllUsers = async (page, limit, search = '', role = '', status = '') => {
    try {
        const params = { page, limit };
        if (search) params.search = search;
        if (role) params.role = role;
        if (status) params.status = status;
        const response = await api.get("/user/get-all-users", {
            params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateStatusUser = async (userId, status, role) => {
    try {
        const response = await api.put("/user/update-status", { userId, status, role }, {
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
