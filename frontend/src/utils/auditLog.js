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
