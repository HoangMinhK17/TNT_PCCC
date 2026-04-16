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


export const processRichTextContent = async (content, folder = "tnt_shared_uploads") => {
    if (!content || typeof content !== 'string') return content;
    const base64Regex = /src="(data:image\/[^;]+;base64,[^"]+)"/g;
    let match;
    let newContent = content;
    const matches = [];

    while ((match = base64Regex.exec(content)) !== null) {
        matches.push(match[1]);
    }

    if (matches.length === 0) return content;

    for (const base64Data of matches) {
        try {
            const res = await fetch(base64Data);
            const blob = await res.blob();
            const extension = blob.type.split('/')[1] || 'png';
            const file = new File([blob], `rich-text-image-${Date.now()}.${extension}`, { type: blob.type });
            const url = await uploadImageToCloudinary(file, folder);
            newContent = newContent.split(base64Data).join(url);
        } catch (error) {
            console.error("Error processing rich text image:", error);
        }
    }
    return newContent;
};
