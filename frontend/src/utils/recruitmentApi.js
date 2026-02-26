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

export { getRecruitment };



