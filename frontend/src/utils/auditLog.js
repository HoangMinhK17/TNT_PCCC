import api from "./api";

export const getAllAuditLogs = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`/auditLog/get-all-audit-logs?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        return response.data;
    } catch (error) {
        return error;
    }
};

export const getAuditLogsByUser = async (userId) => {
    try {
        const response = await appi.get(`/auditLog/get-audit-logs-by-user/${userId}`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getAuditLogsByModule = async (module) => {
    try {
        const response = await appi.get(`/auditLog/get-audit-logs-by-module/${module}`);
        return response.data;
    } catch (error) {
        return error;
    }
};