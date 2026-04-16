import api from "./api";

const getRecruitment = async () => {
    try {
        const response = await api.get("/recruitment/get-recruiments");
        return response.data;
    } catch (error) {
        console.error("Error fetching recruitment:", error);
        throw error;
    }
};

const getRecruitmentForManage = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`/recruitment/get-recruiments-for-manage?page=${page}&limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching recruitment for manage:", error);
        throw error;
    }
}


const createRecruitment = async (data) => {
    try {
        const response = await api.post("/recruitment/create-recruiment", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating recruitment:", error);
        throw error;
    }
}

const updateRecruitment = async (id, data) => {
    try {
        const response = await api.put(`/recruitment/update-recruiment/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating recruitment:", error);
        throw error;
    }
}

const deleteRecruitment = async (id) => {
    try {
        const response = await api.delete(`/recruitment/delete-recruiment/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting recruitment:", error);
        throw error;
    }
}

const getRecruimentsByName = async (name, page = 1, limit = 10) => {
    try {
        const response = await api.get(`/recruitment/get-recruiments-by-name/${name}?page=${page}&limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching recruitment by name:", error);
        throw error;
    }
}

export { getRecruitment, getRecruitmentForManage, createRecruitment, updateRecruitment, deleteRecruitment, getRecruimentsByName };



