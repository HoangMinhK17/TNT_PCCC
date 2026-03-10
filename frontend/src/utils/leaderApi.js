import api from "./api";
 
const getAllLeaders = async () => {
    const response = await api.get("/leader/get-all-leaders");
    return response.data;
};

const getAllLeadersForManagement = async (page, limit) => {
    const response = await api.get(`/leader/get-all-leaders-for-management?page=${page}&limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

const findLeaderByName = async (name, page, limit) => {
    const response = await api.get(`/leader/find-leader-by-name/${name}?page=${page}&limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

const createLeader = async (data) => {
    const response = await api.post("/leader/create-leader", data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

const updateLeader = async (id, data) => {
    const response = await api.put(`/leader/update-leader/${id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

const deleteLeader = async (id) => {
    const response = await api.delete(`/leader/delete-leader/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export { getAllLeaders, getAllLeadersForManagement, findLeaderByName, createLeader, updateLeader, deleteLeader };