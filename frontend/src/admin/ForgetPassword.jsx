import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Login.css";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Reset password for:", email);
        alert("Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn.");
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <Link to="/">
                    <img src="/src/uploads/tnt.jpg" alt="TNT Logo" className="login-logo" />
                </Link>
                <h2>Quên mật khẩu</h2>
                <p style={{ color: "#666", marginBottom: "20px", fontSize: "16px" }}>
                    Nhập email của bạn để đặt lại mật khẩu.
                </p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email đăng ký</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@gmail.com"
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        Gửi yêu cầu
                    </button>
                </form>

                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Link to="/admin/login" className="back-to-site">
                        Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;