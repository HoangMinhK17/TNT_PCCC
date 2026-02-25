import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductSection.css';
import { getPublicProducts } from '../utils/productApi';

const ProductSection = () => {
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await getPublicProducts();
                setProducts(data);
                setVisibleProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length === 0) return;

        const interval = setInterval(() => {
            setVisibleProducts(prev => {
                if (prev.length <= 1) return prev;
                const newProducts = [...prev];
                const firstProduct = newProducts.shift();
                newProducts.push(firstProduct);
                return newProducts;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [products]);

    if (loading) return null;

    return (
        <section id="products" className="products-section">
            <div className="container" data-aos="fade-up">
                <h2 className="section-title">Danh sách sản phẩm nổi bật</h2>
                <div className="products-grid">
                    {visibleProducts.slice(0, 4).map(product => (
                        <Link
                            key={product._id}
                            to={`/products/${product._id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <div className="product-card">
                                <img src={product.image[0]} alt={product.name} className="product-image" />
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-description">{product.title}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;
