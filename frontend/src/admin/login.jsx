import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login data:", formData);
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

                    <button type="submit" className="login-btn">
                        Đăng nhập
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