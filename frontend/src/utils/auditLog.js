import api from "./api";

export const getAllAuditLogs = async (page = 1, limit = 10, filters = {}) => {
    try {
        const params = new URLSearchParams({ page, limit });
        if (filters.search) params.append("search", filters.search);
        if (filters.action) params.append("action", filters.action);
        if (filters.module) params.append("module", filters.module);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);

        const response = await api.get(`/auditLog/get-all-audit-logs?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        return response.data;
    } catch (error) {
        return error;
    }
};

export const getModulFilter = async () => {
    try {
        const response = await api.get("/auditLog/get-modul-filter", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getActionFilter = async () => {
    try {
        const response = await api.get("/auditLog/get-action-filter", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

