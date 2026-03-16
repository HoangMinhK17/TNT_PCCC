import api from "./api";

export const getThemeFooter = async () => {
    const response = await api.get("/themeFooter/get-theme-footer");
    return response.data;
}

export const updateThemeFooter = async (id, data) => {
    const response = await api.put(`/themeFooter/update-theme-footer/${id}`, data, 
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    return response.data;
}



export default { getThemeFooter, updateThemeFooter };