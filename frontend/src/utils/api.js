import axios from "axios";
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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            if (error.response.status === 401 || error.response.status === 403) {
                const msg = error.response.data?.message?.toLowerCase() || "";
                if (msg.includes("token") || msg.includes("forbidden") || msg.includes("unauthorized") || error.response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    if (window.location.pathname !== '/admin/login' && window.location.pathname.startsWith('/admin')) {
                        window.location.href = '/admin/login';
                        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
                    }
                }
            }
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;