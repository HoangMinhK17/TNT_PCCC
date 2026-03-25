import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductSection.css';
import { getPublicProducts } from '../utils/productApi';
import { getCategoryProducts } from '../utils/categoryProductApi';

const ProductSection = () => {
    const [categories, setCategories] = useState([]);
    const [visibleCategories, setVisibleCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <section id="products" className="products-section">
            <div className="container" data-aos="fade-up">
                <h2 className="section-title">Danh mục sản phẩm</h2>
                <div className="products-grid">
                    {visibleCategories.slice(0, 4).map(category => {
                        const categoryProducts = products.filter(
                            p => p.categoryId?._id === category._id || p.categoryId === category._id
                        );
                        
                        return (
                            <Link
                                key={category._id}
                                to={`/products?category=${category.name}&categoryId=${category._id}`}
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <div className="product-card">
                                    {categoryProducts.length > 0 && categoryProducts[0].image && categoryProducts[0].image.length > 0 ? (
                                        <img src={categoryProducts[0].image[0]} alt={category.name} className="product-image" />
                                    ) : (
                                        <div className="product-image" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', height: '200px', width: '100%', objectFit: 'cover'}}>
                                            <span style={{color: '#999'}}>Không có ảnh</span>
                                        </div>
                                    )}
                                    <h3 className="product-name" style={{ textAlign: 'center', marginTop: '15px' }}>{category.name}</h3>
                                    <p className="product-description" style={{ textAlign: 'center' }}>{categoryProducts.length} sản phẩm</p>
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
