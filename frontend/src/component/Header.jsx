import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { useTranslation } from 'react-i18next';
import { getCategoryProducts } from '../utils/categoryProductApi';
import { getCategoryNews } from '../utils/categoryNewsApi';

import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getImageInformation } from '../utils/informationApi';
import { getAllHeader } from '../utils/headerApi';
import { getThemeHeader } from '../utils/themeHeaderApi';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [language, setLanguage] = useState("");
    const [categories, setCategories] = useState([]);
    const [newsCategories, setNewsCategories] = useState([]);
    const [logo, setLogo] = useState([]);
    const [headerTitles, setHeaderTitles] = useState([]);
    const [themeConfig, setThemeConfig] = useState(null);

    const languageGlobal = JSON.parse(localStorage.getItem("language")) || "vn";
    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const res = await getImageInformation();
                const obj = Array.isArray(res) ? res[0] : res;
                const logo = obj?.logo;
                setLogo(logo);
            } catch (error) {
                console.error("Error fetching logo:", error);
            }
        };
        fetchLogo();
    }, []);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const [productData, newsData] = await Promise.all([
                    getCategoryProducts(),
                    getCategoryNews()
                ]);
                setCategories(productData);
                setNewsCategories(newsData);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchHeaders = async () => {
            try {
                const data = await getAllHeader();
                setHeaderTitles(data);
            } catch (error) {
                console.error("Error fetching headers:", error);
            }
        };
        const fetchTheme = async () => {
            try {
                const data = await getThemeHeader();
                setThemeConfig(data);
            } catch (error) {
                console.error("Error fetching theme header:", error);
            }
        };
        fetchHeaders();
        fetchTheme();
    }, []);

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("language", JSON.stringify(lang));
        setLanguage(lang);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setActiveSubmenu(null);
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

    const PATH_MAP = {
        home: { path: '/', hasSubmenu: false, key: 'home' },
        about: { path: '/about', hasSubmenu: false, key: 'about' },
        products: { path: '/products', hasSubmenu: true, key: 'products' },
        services: { path: '/services', hasSubmenu: false, key: 'services' },
        projects: { path: '/projects', hasSubmenu: false, key: 'projects' },
        recruitment: { path: '/recruitment', hasSubmenu: false, key: 'recruitment' },
        news: { path: '/news', hasSubmenu: true, key: 'news' },
        contact: { path: '/contact', hasSubmenu: false, key: 'contact' },
        feedback: { path: '/feedback', hasSubmenu: false, key: 'feedback' },
        management: { path: '/management', hasSubmenu: false, key: 'management' }
    };

    const menuItems = headerTitles.map(header => {
        const enKey = header.key?.toLowerCase() || '';
        const mapInfo = PATH_MAP[enKey] || { path: '/', hasSubmenu: false, key: enKey };
        const label = languageGlobal === 'vn' ? header.name_vn : header.name_en;
        return {
            ...mapInfo,
            label: label
        };
    });

    return (
        <header
            className="header"
            style={{
                backgroundColor: themeConfig?.background_color || '#ffffff',
            }}
        >

            <div className="header-container">
                <Link to="/" className="logo" onClick={closeMenu}>
                    <img src={logo} alt="Logo" className="logo-img" />
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
                                    <Link
                                        to={item.path}
                                        onClick={closeMenu}
                                        style={{
                                            color: themeConfig?.text_color || '#333333',
                                            fontSize: themeConfig?.text_size || '16px'
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                    {item.hasSubmenu && (
                                        <span
                                            className="submenu-toggle"
                                            onClick={(e) => toggleSubmenu(index, e)}
                                        >
                                            {activeSubmenu === index ? <FaChevronUp /> : <FaChevronDown />}
                                        </span>
                                    )}
                                </div>

                                {item.key === 'products' && (
                                    <ul className={`dropdown ${activeSubmenu === index ? 'open' : ''}`}>
                                        {categories.map((category, idx) => (
                                            <li key={idx}>
                                                <Link
                                                    to={`/products?category=${encodeURIComponent(category.name)}&categoryId=${category._id}`}
                                                    onClick={closeMenu}
                                                >
                                                    {category.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {item.key === 'news' && (
                                    <ul className={`dropdown ${activeSubmenu === index ? 'open' : ''}`}>
                                        {newsCategories.map((category, idx) => (
                                            <li key={idx}>
                                                <Link
                                                    to={`/news?category=${encodeURIComponent(category.name)}&categoryId=${category._id}`}
                                                    onClick={closeMenu}
                                                >
                                                    {category.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
                {/* <div className="language-switcher">
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
             
                </div> */}
            </div>
        </header>
    );
};

export default Header;
