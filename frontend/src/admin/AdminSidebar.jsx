import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaBoxOpen,
    FaProjectDiagram,
    FaNewspaper,
    FaUserTie,
    FaEnvelope,
    FaConciergeBell,
    FaSignOutAlt,
    FaHome
} from 'react-icons/fa';

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Implement logout logic
        alert("Đã đăng xuất!");
        navigate('/admin/login');
    };

    const menuItems = [
        { label: 'Tổng quan', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
        { label: 'Sản phẩm', path: '/admin/products', icon: <FaBoxOpen /> },
        { label: 'Dự án', path: '/admin/projects', icon: <FaProjectDiagram /> },
        { label: 'Dịch vụ', path: '/admin/services', icon: <FaConciergeBell /> },
        { label: 'Tin tức', path: '/admin/news', icon: <FaNewspaper /> },
        { label: 'Tuyển dụng', path: '/admin/recruitment', icon: <FaUserTie /> },
        { label: 'Liên hệ', path: '/admin/contacts', icon: <FaEnvelope /> },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-header">
                <img src="/src/uploads/tnt.jpg" alt="TNT Logo" className="admin-logo" />
                <h4>Quản trị TNT</h4>
            </div>

            <ul className="admin-sidebar-menu">
                {menuItems.map((item, index) => (
                    <li key={index} className="admin-menu-item">
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => `admin-menu-link ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="admin-sidebar-footer">
                <button className="admin-menu-link" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', width: '100%', marginBottom: '10px' }}>
                    <FaHome />
                    <span>Về trang chủ</span>
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Đăng xuất
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
