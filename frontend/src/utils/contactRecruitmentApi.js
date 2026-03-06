import api from "./api";

export const createContactRecruitment = async (contactRecruitment) => {
    try {
        const response = await api.post("/contactRecruitment/create-contact-recruitment", contactRecruitment);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getContactRecruitment = async (page, limit) => {
    try {
        const response = await api.get(`/contactRecruitment/get-contact-recruitment?page=${page}&limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getContactRecruitmentByNameOrPhone = async (nameOrPhone, page, limit) => {
    try {
        const response = await api.get(`/contactRecruitment/get-contact-recruitment-by-name-or-phone/${nameOrPhone}?page=${page}&limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
  
}

export const getContactRecruitmentByStatus = async (status, page, limit) => {
    try {
        const response = await api.get(`/contactRecruitment/get-contact-recruitment-by-status/${status}?page=${page}&limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });
        return response.data;

    } catch (error) {
        return error.response.data;
    }

}

export const updateContactRecruitment = async (id, contactRecruitment) => {
    try {
        const response = await api.put(`/contactRecruitment/update-contact-recruitment/${id}`, contactRecruitment, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }

}

export const deleteContactRecruitment = async (id) => {
    try {
        const response = await api.delete(`/contactRecruitment/delete-contact-recruitment/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getContactRecruitmentById = async (id) => {
    try {
        const response = await api.get(`/contactRecruitment/get-contact-recruitment-by-id/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}