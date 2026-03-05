import api from "./api";

export const getWhyChooseCompany = async () => {
    try {
        const response = await api.get("/whyChooseCompany/get-why-choose-company");
        return response.data;
    } catch (error) {
        console.error("Error fetching why choose company:", error);
        throw error;
    }
}

export const createWhyChooseCompany = async (data) => {
    try {
        const response = await api.post("/whyChooseCompany/create-why-choose-company", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating why choose company:", error);
        throw error;
    }
}

export const updateWhyChooseCompany = async (id, data) => {
    try {
        const response = await api.put(`/whyChooseCompany/update-why-choose-company/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating why choose company:", error);
        throw error;
    }
}

export const deleteWhyChooseCompany = async (id) => {
    try {
        const response = await api.delete(`/whyChooseCompany/delete-why-choose-company/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting why choose company:", error);
        throw error;
    }
}

export const getWhyChooseCompanyForManage = async () => {
    try {
        const response = await api.get("/whyChooseCompany/get-why-choose-company-for-manage", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching why choose company for manage:", error);
        throw error;
    }
}
