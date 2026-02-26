import api from "./api";

export const getProjects = async (page = 1, limit = 10) => {
    const response = await api.get(`/project/get-projects?page=${page}&limit=${limit}`);
    return response.data;
};

export const createProject = async (project) => {
    const response = await api.post("/project/create-project", project);
    return response.data;
};

export const updateProject = async (id, project) => {
    const response = await api.put(`/project/update-project/${id}`, project);
    return response.data;
};

export const deleteProject = async (id) => {
    const response = await api.delete(`/project/delete-project/${id}`);
    return response.data;
};

export const getProjectById = async (id) => {
    const response = await api.get(`/project/detail-project/${id}`);
    return response.data;
};
