import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
import '../styles/ProductSection.css';

const ProductSection = () => {
    // Use imported products
    // Filter only featured products for the section
    const [visibleProducts, setVisibleProducts] = useState(products.filter(p => p.isFeatured));

    React.useEffect(() => {
        const interval = setInterval(() => {
            setVisibleProducts(prev => {
                if (prev.length <= 1) return prev;
                const newProducts = [...prev];
                const firstProduct = newProducts.shift();
                newProducts.push(firstProduct);
                return newProducts;
            });
        }, 5000); // Rotate every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section id="products" className="products-section">
            <div className="container" data-aos="fade-up">


                <h2 className="section-title">Danh sách sản phẩm nổi bật</h2>
                <div className="products-grid">
                    {visibleProducts.slice(0, 4).map(product => (
                        <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <div className="product-card">
                                <img src={product.images[0]} alt={product.name} className="product-image" />

                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-description">{product.description}</p>
                            </div>
                        </Link>
                    ))}

                </div>
            </div>
        </section>
    );
};

export default ProductSection;
