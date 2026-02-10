import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        // Find product by id from URL
        const foundProduct = products.find(p => p.id === parseInt(id));
        if (foundProduct) {
            setProduct(foundProduct);
            setActiveImage(foundProduct.images[0]); // Set initial image
            window.scrollTo(0, 0); // Scroll to top when loaded
        }
    }, [id]);

    if (!product) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <h2>Không tìm thấy sản phẩm</h2>
                <Link to="/products" className="btn-product">Quay lại danh sách</Link>
            </div>
        );
    }

    return (
        <section className="product-detail-section">
            <div className="container" >
                <div className="product-detail-container">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image-container">
                            <img src={activeImage} alt={product.name} className="main-image" />
                        </div>
                        <div className="thumbnail-list">
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail-item ${activeImage === img ? 'active' : ''}`}
                                    onClick={() => setActiveImage(img)}
                                >
                                    <img src={img} alt={`${product.name} ${index + 1}`} className="thumbnail-image" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info-detail">
                        <span className="product-category-detail">{product.category}</span>
                        <h1 className="product-title-detail">{product.name}</h1>

                        <div className="product-description-detail">
                            <p>{product.description}</p>
                        </div>

                        <div className="product-specs">
                            <h3>Chi tiết sản phẩm</h3>
                            <p>{product.detail}</p>
                        </div>

                        <div className="product-actions">
                            <Link to="/contact" className="contact-btn">
                                Liên hệ tư vấn
                            </Link>


                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;
