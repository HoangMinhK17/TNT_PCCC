import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { useTranslation } from 'react-i18next';
import { products } from '../data/products';
import { news } from '../data/news';

import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null); // Track active submenu
    const [language, setLanguage] = useState("");

    const languageGlobal = JSON.parse(localStorage.getItem("language")) || "vn";


    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("language", JSON.stringify(lang));
        setLanguage(lang); // Update local state to trigger re-render if needed
    };

    console.log(language);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setActiveSubmenu(null); // Reset submenus when toggling main menu
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        setActiveSubmenu(null);
    };

    const toggleSubmenu = (index, e) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveSubmenu(activeSubmenu === index ? null : index);
    };

    const { t, i18n } = useTranslation();

    const menuItems = [
        { label: t("home"), path: '/' },
        { label: t("about"), path: '/about' },
        { label: t("products"), path: '/products', hasSubmenu: true },
        { label: t("services"), path: '/services' },
        { label: t("projects"), path: '/projects' },
        { label: t("recruitment"), path: '/recruitment' },
        { label: t("news"), path: '/news', hasSubmenu: true },
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
                            <li key={index} className={`menu-item ${activeSubmenu === index ? 'submenu-open' : ''}`}>
                                <div className="menu-link-wrapper">
                                    <Link to={item.path} onClick={closeMenu}>{item.label}</Link>
                                    {item.hasSubmenu && (
                                        <span
                                            className="submenu-toggle"
                                            onClick={(e) => toggleSubmenu(index, e)}
                                        >
                                            {activeSubmenu === index ? <FaChevronUp /> : <FaChevronDown />}
                                        </span>
                                    )}
                                </div>

                                {item.label === t("products") && (
                                    <ul className={`dropdown ${activeSubmenu === index ? 'open' : ''}`}>
                                        {[...new Set(products.map(p => p.category))].map((category, idx) => (
                                            <li key={idx}>
                                                <Link
                                                    to={`/products?category=${encodeURIComponent(category)}`}
                                                    onClick={closeMenu}
                                                >
                                                    {category}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {item.label === t("news") && (
                                    <ul className={`dropdown ${activeSubmenu === index ? 'open' : ''}`}>
                                        {[...new Set(news.map(n => n.category))].map((category, idx) => (
                                            <li key={idx}>
                                                <Link
                                                    to={`/news?category=${encodeURIComponent(category)}`}
                                                    onClick={closeMenu}
                                                >
                                                    {category}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="language-switcher">
                    <img
                        src="src/uploads/language/vietnam.png"
                        alt="VN"
                        className={`language-flag ${languageGlobal === 'vn' ? 'active' : ''}`}
                        onClick={() => handleLanguageChange('vn')}
                    />
                    <img
                        src="src/uploads/language/united-kingdom.png"
                        alt="EN"
                        className={`language-flag ${languageGlobal === 'en' ? 'active' : ''}`}
                        onClick={() => handleLanguageChange('en')}
                    />
                    <img
                        src="src/uploads/language/china.png"
                        alt="CH"
                        className={`language-flag ${languageGlobal === 'ch' ? 'active' : ''}`}
                        onClick={() => handleLanguageChange('ch')}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
