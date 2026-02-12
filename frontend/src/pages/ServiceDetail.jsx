import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { services } from '../data/services';
import '../styles/ServiceDetail.css';

const ServiceDetail = () => {
    const { id } = useParams();
    const service = services.find(s => s.id === parseInt(id));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!service) {
        return (
            <div className="service-detail-container">
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h2>Dịch vụ không tồn tại</h2>
                    <Link to="/" className="back-link">Quay lại trang chủ</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="service-detail-page">
            <div className="service-detail-header" style={{ backgroundImage: `url(${service.image})` }}>
                <div className="overlay"></div>
                <div className="container">
                    <h1 className="service-detail-title" data-aos="fade-up">{service.title}</h1>
                </div>
            </div>

            <div className="container service-detail-content">
                <div className="detail-row">
                    <div className="detail-image" data-aos="fade-up">
                        <img src={service.image} alt={service.title} />
                    </div>
                    <div className="detail-info" data-aos="fade-up">
                        <h2>Tổng quan dịch vụ</h2>
                        <p className="detail-description">{service.description}</p>
                        <hr />
                        <h3>Chi tiết</h3>
                        <p className="detail-text">{service.detail}</p>

                        <div className="cta-box">
                            <p>Bạn quan tâm đến dịch vụ này?</p>
                            <Link to="/contact" className="cta-button">Liên hệ báo giá ngay</Link>
                        </div>
                    </div>
                </div>

                <div className="related-services" data-aos="fade-up">
                    <h3>Các dịch vụ khác</h3>
                    <div className="related-grid">
                        {services.filter(s => s.id !== service.id).slice(0, 3).map(related => (
                            <Link key={related.id} to={`/services/${related.id}`} className="related-card">
                                <img src={related.image} alt={related.title} />
                                <h4>{related.title}</h4>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
