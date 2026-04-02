import api from "./api";
const getThemeHeader = async () => {
    try {
        const response = await api.get("/themeHeader/get-theme-header");
        return response.data;
    } catch (error) {
        console.error("Error fetching theme header:", error);
    }
}

const updateThemeHeader = async (id, themeHeader) => {
    try {
        const response = await api.put(`/themeHeader/update-theme-header/${id}`, themeHeader, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating theme header:", error);
    }
}

const createThemeHeader = async (themeHeader) => {
    try {
        const response = await api.post("/themeHeader/create-theme-header", themeHeader, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating theme header:", error);
    }
}

export { getThemeHeader, updateThemeHeader, createThemeHeader };