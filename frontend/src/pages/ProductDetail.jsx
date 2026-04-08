import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/ProductDetail.css';
import SEO from '../component/SEO';
import { getPublicProductById } from '../utils/productApi';
import { useTranslation } from 'react-i18next';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await getPublicProductById(id);
                setProduct(data);
                if (data.image && data.image.length > 0) {
                    setActiveImage(data.image[0]);
                }
                window.scrollTo(0, 0);
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="loading">Đang tải...</div>
        </div>
    );

    if (!product) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <h2>Không tìm thấy sản phẩm</h2>
                <Link to="/products" className="btn-product">Quay lại danh sách</Link>
            </div>
        );
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.image[0],
        "category": product.categoryId?.name,
        "brand": { "@type": "Organization", "name": "" }
    };

    return (
        <section className="product-detail-section">
            <SEO
                title={product.name}
                description={product.description}
                keywords={`${product.name}, ${product.categoryId?.name}`}
                image={product.image[0]}
                url={`/products/${product._id}`}
                schema={structuredData}
            />
            <div className="container" >
                <div className="product-detail-container">
                    <div className="product-gallery">
                        <div className="main-image-container">
                            <img src={activeImage} alt={product.name} className="main-image" />
                        </div>
                        <div className="thumbnail-list">
                            {product.image.map((img, index) => (
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

                    <div className="product-info-detail">
                        <span className="product-category-detail">{product.categoryId?.name}</span>
                        <h1 className="product-title-detail">{product.name}</h1>

                        <div className="product-description-detail">
                            <p>{product.title}</p>
                        </div>

                        <div className="product-specs">
                            <h3>{t('product_detail_des')}</h3>
                            <p>{product.description}</p>

                            {product.technical && product.technical.length > 0 && (
                                <div className="specs-container">
                                    <h4>{t('product_detail_spec')}</h4>
                                    <table className="specs-table">
                                        <tbody>
                                            {product.technical.map((spec, index) => (
                                                <tr key={index} className="specs-row">
                                                    <td className="specs-label">{spec.title}</td>
                                                    <td className="specs-value">{spec.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <div className="product-actions">
                            <Link
                                to="/contact"
                                className="contact-btn"
                            >
                                {t('product_detail_button_contact')}
                            </Link>
                            <Link
                                to="/contact"
                                state={{ productId: product._id, productName: product.name, productImage: product.image[0] }}
                                className="contact-btn buy-btn"
                            >
                                {t('product_detail_register')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;
