import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [language, setLanguage] = useState("");

    const languageGlobal = JSON.parse(localStorage.getItem("language")) || "vn";


    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value);
        localStorage.setItem("language", JSON.stringify(e.target.value));
    };

    console.log(language);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const { t, i18n } = useTranslation();

    const menuItems = [
        { label: t("home"), path: '/' },
        { label: t("about"), path: '/about' },
        { label: t("products"), path: '/products' },
        { label: t("services"), path: '/services' },
        { label: t("projects"), path: '/projects' },
        { label: t("recruitment"), path: '/recruitment' },
        { label: t("news"), path: '/news' },
        { label: t("contact"), path: '/contact' }
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
                            <li key={index} className="menu-item">
                                <Link to={item.path} onClick={closeMenu}>{item.label}</Link>
                                {item.label === t("products") && (
                                    <ul className="dropdown">
                                        <li><Link to="/products/pccc">PCCC</Link></li>
                                        <li><Link to="/products/pccc">Bình chữa cháy</Link></li>

                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="language-switcher">
                    <select defaultValue={languageGlobal} className="language-select" onChange={handleLanguageChange}>
                        <option value="vn">VN</option>
                        <option value="en">ENG</option>
                        <option value="ch">CH</option>
                    </select>
                </div>
            </div>
        </header>
    );
};

export default Header;
