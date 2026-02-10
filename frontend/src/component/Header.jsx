import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const menuItems = [
        { label: 'Trang chủ', path: '/' },
        { label: 'Giới thiệu', path: '/about' },
        { label: 'Sản phẩm', path: '/products' },
        { label: 'Dịch vụ', path: '/services' },
        { label: 'Dự án', path: '/projects' },
        { label: 'Tuyển dụng', path: '/recruitment' },
        { label: 'Tin tức', path: '/news' },
        { label: 'Liên hệ', path: '/contact' }
    ];

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo" onClick={closeMenu}>
                    <img src="src/uploads/tnt.jpg" alt="Logo" className="logo-img" />
                </Link>



                <div className="menu-toggle" onClick={toggleMenu}>
                    <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <nav className={`menu ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="menu-items">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link to={item.path} onClick={closeMenu}>{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="language-switcher">
                    <select className="language-select">
                        <option value="vn">VN</option>
                        <option value="en">ENG</option>
                        <option value="cn">CH</option>
                    </select>
                </div>
            </div>
        </header>
    );
};

export default Header;
