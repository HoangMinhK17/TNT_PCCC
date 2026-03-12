import api from "./api";

const getPublicTestimonials = async () => {
    const response = await api.get("/testimonial/get-public-testimonials");
    return response.data;
};

const createTestimonial = async (testimonial) => {
    const response = await api.post("/testimonial/create-testimonial", testimonial, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

const updateTestimonial = async (id, testimonial) => {
    const response = await api.put(`/testimonial/update-testimonial/${id}`, testimonial, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

const deleteTestimonial = async (id) => {
    const response = await api.delete(`/testimonial/delete-testimonial/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

const searchTestimonial = async (name, page, limit) => {
    const response = await api.get(`/testimonial/search-testimonial?name=${name}&page=${page}&limit=${limit}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

const getTestimonialsForManage = async (page, limit) => {
    const response = await api.get(`/testimonial/manage-testimonials?page=${page}&limit=${limit}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
};

export { getPublicTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, searchTestimonial, getTestimonialsForManage };