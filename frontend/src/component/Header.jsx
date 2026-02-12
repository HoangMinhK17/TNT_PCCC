import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { useTranslation } from 'react-i18next';
import { products } from '../data/products';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
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
