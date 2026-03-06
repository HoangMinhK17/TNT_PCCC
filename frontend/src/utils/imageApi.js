import api from "./api";
export const uploadImageToCloudinary = async (file, folder = "tnt_shared_uploads") => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);
    const response = await api.post("/upload/upload-image", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data.url;
};

export const uploadCvToCloudinary = async (file, folder = "tnt_cv_uploads") => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("cv", file);
    formData.append("folder", folder);
    const response = await api.post("/upload/upload-cv", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data.url;
};

