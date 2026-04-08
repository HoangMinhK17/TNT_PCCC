import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPasswordAPI } from '../utils/userApi';
import "../styles/Login.css";
import { getImageInformation } from '../utils/informationApi';

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [logo, setLogo] = useState("/src/uploads/tnt.jpg");
    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const data = await getImageInformation();
                setLogo(Array.isArray(data) ? data[0]?.logo : data?.logo);
            } catch (error) {
                console.error("Error fetching logo:", error);
            }
        };
        fetchLogo();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPasswordAPI(email);
            toast.success("Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <Link to="/">
                    <img src={logo} alt="TNT Logo" className="login-logo" />
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

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
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