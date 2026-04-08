import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPasswordAPI } from '../utils/userApi';
import "../styles/Login.css";
import { getImageInformation } from '../utils/informationApi';


const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { retoken } = useParams();
    const navigate = useNavigate();
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
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp.");
            return;
        }

        setLoading(true);
        try {
            await resetPasswordAPI(retoken, newPassword);
            toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
            navigate('/admin/login');
        } catch (error) {
            toast.error(error.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn.");
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
                <h2>Đặt lại mật khẩu</h2>
                <p style={{ color: "#666", marginBottom: "20px", fontSize: "16px" }}>
                    Vui lòng nhập mật khẩu mới của bạn.
                </p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="newPassword">Mật khẩu mới</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu"
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
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

export default ResetPassword;
