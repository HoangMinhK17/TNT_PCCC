import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import "../styles/Login.css";
import { loginUser } from "../utils/userApi";
import { getImageInformation } from "../utils/informationApi";
import { initSocket, registerUser, disconnectSocket } from "../utils/socket";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const [information, setInformation] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getImageInformation();
                setInformation(Array.isArray(data) ? data[0] : data);
            } catch (error) {
                console.error('Error fetching information:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await loginUser(formData.username.trim(), formData.password.trim());
            if (data.token && data.user.role === "admin" || data.user.role === "staff") {
                if (data.user.role === "admin" && data.user.status === "inactive") {
                    toast.error("Tài khoản Admin của bạn đã bị vô hiệu hóa");
                    return;
                }
                if (data.user.role === "staff" && data.user.status === "inactive") {
                    toast.error("Tài khoản Staff của bạn đã bị vô hiệu hóa");
                    return;
                }
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                
                // deviceId đã được cập nhật đúng (theo email) trong loginUser()
                // Phải disconnect socket cũ rồi re-init để tránh
                // trường hợp socket cũ của account khác vẫn dùng cùng socketId
                disconnectSocket();
                const deviceId = localStorage.getItem('deviceId');
                if (data.user.id && deviceId) {
                    const sock = initSocket();
                    registerUser(data.user.id, deviceId);
                    sock.on('connect', () => {
                        registerUser(data.user.id, deviceId);
                    });
                }

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
                    <img src={information?.logo} alt="TNT Logo" className="login-logo" />
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
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(prev => !prev)}
                                tabIndex={-1}
                                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
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