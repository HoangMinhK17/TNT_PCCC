import api from "./api";

const getContactsForManage = async (page, limit) => {
    const response = await api.get(`/contact/get-contact-for-manage?page=${page}&limit=${limit}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.data;
};

const getContactById = async (id) => {
    const response = await api.get(`/contact/get-contact-by-id/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.data;
};

const createContact = async (contact) => {
    const response = await api.post("/contact/create-contact", contact);
    return response.data;
};

const updateContact = async (id, contact) => {
    const response = await api.put(`/contact/update-contact/${id}`, contact, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.data;
};

const deleteContact = async (id) => {
    const response = await api.delete(`/contact/delete-contact/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.data;
};

const findContactByNameOrPhone = async (name, phone, page, limit) => {
    const response = await api.post(`/contact/find-contact-by-name-or-phone?page=${page}&limit=${limit}`, { name, phone }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.data;
};

const filterByStatus = async (status, page, limit) => {
    const response = await api.post(`/contact/filter-by-status?page=${page}&limit=${limit}`, { status }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.data;
};

export { getContactsForManage, getContactById, createContact, updateContact, deleteContact, findContactByNameOrPhone, filterByStatus };