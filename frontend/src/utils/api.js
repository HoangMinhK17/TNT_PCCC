import axios from "axios";
import { toast } from "react-toastify";
// const api = axios.create({
//     baseURL: '/api',
//     headers: {
//         "Content-Type": "application/json",
//     },
//     timeout: 10000,
// });

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,

    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

let isAlerting = false;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (!originalRequest._retry) {
                originalRequest._retry = true;

                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    try {
                        const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/refresh-token`, { refreshToken });
                        if (res.data && res.data.token) {
                            localStorage.setItem('token', res.data.token);
                            originalRequest.headers['Authorization'] = `Bearer ${res.data.token}`;
                            return api(originalRequest);
                        }
                    } catch (refreshError) {
                        console.error('Refresh token failed:', refreshError);
                    }
                }
            }

            const msg = error.response.data?.message?.toLowerCase() || "";
            if (msg.includes("token") || msg.includes("unauthorized") || error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('refreshToken');
                if (window.location.pathname !== '/admin/login' && window.location.pathname.startsWith('/admin')) {
                    if (!isAlerting) {
                        isAlerting = true;
                        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
                        window.location.href = '/admin/login';
                    }
                }
            }
        }
        if (error.response && error.response.status === 429) {
            const msg = error.response.data?.message || "Bạn đang thao tác quá nhanh. Vui lòng thử lại sau!";
            // Dùng toastId cố định để tránh hiển thị nhiều toast 429 chồng lên nhau
            toast.warn(msg, {
                toastId: "rate-limit-toast",
                autoClose: 5000,
            });
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default api;