import api from "./api";

export const getProjects = async (page = 1, limit = 10) => {
    const response = await api.get(`/project/get-projects?page=${page}&limit=${limit}`);
    return response.data;
};

export const createProject = async (project) => {
    const token = localStorage.getItem("token");
    const response = await api.post("/project/create-project", project, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateProject = async (id, project) => {
    const token = localStorage.getItem("token");
    const response = await api.put(`/project/update-project/${id}`, project, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteProject = async (id) => {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/project/delete-project/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getProjectById = async (id) => {
    const response = await api.get(`/project/detail-project/${id}`);
    return response.data;
};

export const getProjectsForManage = async () => {
    const token = localStorage.getItem("token");
    const response = await api.get("/project/get-projects-for-manage", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getProjectByName = async (name, page = 1, limit = 10) => {
    const token = localStorage.getItem("token");
    const response = await api.get(`/project/get-project-by-name/${name}?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};



