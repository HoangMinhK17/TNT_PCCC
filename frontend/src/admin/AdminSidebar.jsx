import React, { useState } from 'react';
import { useEffect } from 'react';
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
    FaHome,
    FaInfoCircle,
    FaTimes,
    FaStar,
    FaCogs,
    FaHandshake,
    FaBuilding
} from 'react-icons/fa';
import { getImageInformation } from '../utils/informationApi';

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert("Đã đăng xuất!");
        navigate('/admin/login');
    };

    const menuItems = [
        { label: 'Tổng quan', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
        { label: 'Giới thiệu', path: '/admin/about', icon: <FaInfoCircle /> },
        { label: 'Sản phẩm', path: '/admin/products', icon: <FaBoxOpen /> },
        { label: 'Dự án', path: '/admin/projects', icon: <FaProjectDiagram /> },
        { label: 'Dịch vụ', path: '/admin/services', icon: <FaConciergeBell /> },
        { label: 'Tin tức', path: '/admin/news', icon: <FaNewspaper /> },
        { label: 'Tuyển dụng', path: '/admin/recruitment', icon: <FaUserTie /> },
        { label: 'Liên hệ', path: '/admin/contacts', icon: <FaEnvelope /> },
        { label: 'Đối tác', path: '/admin/partners', icon: <FaHandshake /> },
        { label: 'Đánh giá', path: '/admin/testimonial', icon: <FaStar /> },
        { label: 'Cấu hình hệ thống', path: '/admin/information', icon: <FaCogs /> },
        
    ];

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

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-header">
                <img src={information?.logo} alt="TNT Logo" className="admin-logo" />
                <h4>FMS Website Builder - {information?.name}</h4>
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
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Đăng xuất
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
