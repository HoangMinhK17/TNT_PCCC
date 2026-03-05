import api from "./api";

const getContractsForManage = async (page, limit) => {
    const response = await api.get(`/contract/get-contract-for-manage?page=${page}&limit=${limit}`,{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.data;
};

const getContractById = async (id) => {
    const response = await api.get(`/contract/get-contract-by-id/${id}`,{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.data;
};

const createContract = async (contract) => {
    const response = await api.post("/contract/create-contract", contract);
    return response.data;
};

const updateContract = async (id, contract) => {
    const response = await api.put(`/contract/update-contract/${id}`, contract, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.data;
};

const deleteContract = async (id) => {
    const response = await api.delete(`/contract/delete-contract/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.data;
};

const findContractByNameOrPhone = async (name, phone, page, limit) => {
    const response = await api.post(`/contract/find-contract-by-name-or-phone?page=${page}&limit=${limit}`, { name, phone }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.data;
};

const filterByStatus = async (status, page, limit) => {
    const response = await api.post(`/contract/filter-by-status?page=${page}&limit=${limit}`, { status }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.data;
};

export { getContractsForManage, getContractById, createContract, updateContract, deleteContract, findContractByNameOrPhone, filterByStatus };