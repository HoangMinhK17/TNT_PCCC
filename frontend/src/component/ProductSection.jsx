import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductSection.css';
import { getPublicProducts } from '../utils/productApi';
import { getCategoryProducts } from '../utils/categoryProductApi';
import { useThemeSettings } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const ProductSection = () => {
    const [categories, setCategories] = useState([]);
    const [visibleCategories, setVisibleCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { themeLayout } = useThemeSettings();
    const variant = themeLayout?.product || 'grid-4';
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [categoriesData, productsData] = await Promise.all([
                    getCategoryProducts(),
                    getPublicProducts()
                ]);
                const validCategories = Array.isArray(categoriesData) ? categoriesData : [];
                const validProducts = Array.isArray(productsData) ? productsData : [];
                setCategories(validCategories);
                setVisibleCategories(validCategories);
                setProducts(validProducts);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (categories.length === 0) return;
        const interval = setInterval(() => {
            setVisibleCategories(prev => {
                if (prev.length <= 1) return prev;
                const newCategories = [...prev];
                const firstCategory = newCategories.shift();
                newCategories.push(firstCategory);
                return newCategories;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [categories]);

    if (loading) return null;

    const getCategoryImage = (category) => {
        const categoryProducts = products.filter(
            p => p.categoryId?._id === category._id || p.categoryId === category._id
        )
        const lastProduct = categoryProducts[categoryProducts.length - 1];
        return lastProduct?.image?.length > 0
            ? lastProduct.image[0]
            : null;
    };

    const getCategoryProductCount = (category) => {
        return products.filter(
            p => p.categoryId?._id === category._id || p.categoryId === category._id
        ).length;
    };

    const toUrl = (cat) => `/products?category=${cat.name}&categoryId=${cat._id}`;

    // ── Layout: AI-TEAL (Kolia style) ──────────────────────────────
    if (variant === 'ai-teal') {
        return (
            <section id="products" className="products-section ai-products-section">
                <div className="ai-bg-elements">
                    <div className="ai-blob ai-blob-1"></div>
                    <div className="ai-blob ai-blob-2"></div>
                    <div className="ai-blob ai-blob-3"></div>
                </div>
                <div className="container ai-products-container" data-aos="fade-up">
                    <div className="ai-products-grid">
                        {visibleCategories.slice(0, 3).map(category => {
                            const img = getCategoryImage(category);
                            const count = getCategoryProductCount(category);
                            return (
                                <Link key={category._id} to={toUrl(category)} className="ai-product-card">
                                    <div className="ai-card-hover-effect"></div>
                                    <div className="ai-card-content">
                                        <div className="ai-product-img-wrapper">
                                            {img ? (
                                                <img src={img} alt={category.name} className="ai-product-img" />
                                            ) : (
                                                <div className="ai-product-no-img">
                                                    <span>{category.name}</span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="ai-product-name">{category.name}</h3>
                                        <div className="ai-product-count">
                                            {count} {t('section_products_count')}
                                        </div>
                                    </div>
                                    <div className="ai-product-cta">
                                        <span className="ai-arrow">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }

    // ── Layout: LIST-HORIZONTAL ───────────────────────────────────
    if (variant === 'list-horizontal') {
        return (
            <section id="products" className="products-section">
                <div className="container" data-aos="fade-up">
                    <h2 className="section-title">{t('section_products')}</h2>
                    <div className="products-list-h">
                        {visibleCategories.slice(0, 4).map(category => {
                            const img = getCategoryImage(category);
                            const count = getCategoryProductCount(category);
                            return (
                                <Link key={category._id} to={toUrl(category)} className="products-list-h__item">
                                    <div className="products-list-h__img">
                                        {img
                                            ? <img src={img} alt={category.name} />
                                            : <div className="products-list-h__no-img"></div>
                                        }
                                    </div>
                                    <div className="products-list-h__body">
                                        <h3 className="products-list-h__name">{category.name}</h3>
                                        <p className="products-list-h__count">{count} {t('section_products_count')}</p>
                                        <span className="products-list-h__cta">{t('section_view_now')}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }

    // ── Layout: GRID-3 ────────────────────────────────────────────
    if (variant === 'grid-3') {
        return (
            <section id="products" className="products-section">
                <div className="container" data-aos="fade-up">
                    <h2 className="section-title">{t('section_products')}</h2>
                    <div className="products-grid products-grid--3">
                        {visibleCategories.slice(0, 3).map(category => {
                            const img = getCategoryImage(category);
                            const count = getCategoryProductCount(category);
                            return (
                                <Link key={category._id} to={toUrl(category)} className="product-card product-card--lg" style={{ textDecoration: 'none', color: 'inherit', alignItems: 'center' }}>
                                    <div className="product-card__img-wrapper">
                                        {img
                                            ? <img src={img} alt={category.name} className="product-image" />
                                            : <div className="product-image product-image--placeholder"></div>
                                        }
                                    </div>
                                    <h3 className="product-name">{category.name}</h3>
                                    <p className="product-description">{count} {t('section_products_count')}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="products" className="products-section">
            <div className="container" data-aos="fade-up">
                <h2 className="section-title">{t('section_products')}</h2>
                <div className="products-grid">
                    {visibleCategories.slice(0, 4).map(category => {
                        const img = getCategoryImage(category);
                        const count = getCategoryProductCount(category);
                        return (
                            <Link key={category._id} to={toUrl(category)} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="product-card">
                                    {img
                                        ? <img src={img} alt={category.name} className="product-image" />
                                        : <div className="product-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', height: '200px' }}>
                                            <span style={{ color: '#999' }}>-</span>
                                        </div>
                                    }
                                    <h3 className="product-name" style={{ textAlign: 'center', marginTop: '15px' }}>{category.name}</h3>
                                    <p className="product-description" style={{ textAlign: 'center' }}>{count} {t('section_products_count')}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;
