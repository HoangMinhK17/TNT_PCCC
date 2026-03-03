import api from "./api";

export const loginUser = async (email, password) => {
    try {
        const response = await api.post("/user/login-user", { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createUser = async (name, email, password) => {
    try {
        const response = await api.post("/user/create-user", { name, email, password });
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