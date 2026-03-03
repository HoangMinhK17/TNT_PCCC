import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Login.css";
import { loginUser } from "../utils/userApi";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await loginUser(formData.username, formData.password);
            if (data.token && data.user.role === "admin") {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                toast.success("Đăng nhập thành công!");
                navigate("/admin/dashboard");
            } else {
                toast.error("Bạn không có quyền truy cập");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <Link to="/">
                    <img src="/src/uploads/tnt.jpg" alt="TNT Logo" className="login-logo" />
                </Link>
                <h2>Đăng nhập Admin</h2>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Tên đăng nhập / Email</label>
                        <input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Nhập tên đăng nhập"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Link to="/" className="back-to-site">
                        Quay lại trang chủ
                    </Link>
                    <Link to="/admin/forget-password" className="back-to-site" >
                        Quên mật khẩu
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Login;