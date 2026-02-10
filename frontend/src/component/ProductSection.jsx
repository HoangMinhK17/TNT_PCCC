import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductSection.css';

const ProductSection = () => {
    const [products] = useState([
        {
            id: 1,
            name: 'Bình chữa cháy',
            price: '1,000,000 VND',
            image: 'src/uploads/products/product1.jpg',
            isFeatured: true,
            description: 'Mô tả sản phẩm nổi bật'
        },
        {
            id: 2,
            name: 'Hộp cứu hỏa',
            price: '2,000,000 VND',
            image: 'src/uploads/products/product2.jpg',
            isFeatured: true,
            description: 'Mô tả sản phẩm nổi bật'
        },
        {
            id: 3,
            name: 'Đèn cảnh báo ',
            price: '1,500,000 VND',
            image: 'src/uploads/products/product3.jpg',
            isFeatured: false,
            description: 'Mô tả sản phẩm'
        },
        {
            id: 4,
            name: 'Mặt nạ phòng độc',
            price: '1,800,000 VND',
            image: 'src/uploads/products/product4.jpg',
            isFeatured: false,
            description: 'Mô tả sản phẩm'
        },
        {
            id: 5,
            name: 'Vòi chữa cháy',
            price: '2,200,000 VND',
            image: 'src/uploads/products/product5.jpg',
            isFeatured: true,
            description: 'Mô tả sản phẩm nổi bật'
        },
        {
            id: 6,
            name: 'Mặt nạ phòng khói',
            price: '1,200,000 VND',
            image: 'src/uploads/products/product6.jpg',
            isFeatured: false,
            description: 'Mô tả sản phẩm'
        }
    ]);

    const featuredProducts = products.filter(p => p.isFeatured);

    return (
        <section id="products" className="products-section">
            <div className="container" data-aos="fade-up">


                <h2 className="section-title">Danh sách sản phẩm</h2>
                <div className="products-grid">
                    {products.map(product => (
                        <Link
                            key={product.id}
                            to={`/`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <div className="product-card">
                                <img src={product.image} alt={product.name} className="product-image" />

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
