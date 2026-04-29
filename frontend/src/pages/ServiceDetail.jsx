import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicServiceById } from '../utils/serviceApi';
import '../styles/ServiceDetail.css';
import SEO from '../component/SEO';
import { useTranslation } from 'react-i18next';

const ServiceDetail = () => {
    const { id } = useParams();
    const [service, setService] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchService = async () => {
            try {
                setLoading(true);
                const data = await getPublicServiceById(id);
                setService(data);
            } catch (error) {
                console.error("Error fetching service detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="service-detail-container" style={{ textAlign: 'center', padding: '100px 0' }}>
                <div className="loading">Đang tải chi tiết dịch vụ...</div>
            </div>
        );
    }

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

    const plainDescription = service.description ? service.description.replace(/<[^>]*>?/gm, "") : "";

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.name,
        "description": plainDescription,
        "image": service.image,
        "provider": { "@type": "Organization", "name": "" }
    };

    return (
        <div className="service-detail-page">
            <SEO
                title={service.name}
                description={plainDescription}
                keywords={`${service.name}, dịch vụ `}
                image={service.image}
                url={`/services/${service._id}`}
                schema={structuredData}
            />
            <div className="service-detail-header" style={{ backgroundImage: `url(${service.image})` }}>
                <div className="overlay"></div>
                <div className="container">
                    <h1 className="service-detail-title" data-aos="fade-up">{i18n.language === 'en' && service.name_en ? service.name_en : service.name}</h1>
                </div>
            </div>

            <div className="container service-detail-content">
                <div className="detail-row">
                    <div className="detail-image" data-aos="fade-up">
                        <img src={service.image} alt={service.title} />
                    </div>
                    <div className="detail-info" data-aos="fade-up">
                        <h2>{t('service_detail_overview')}</h2>
                        <p className="detail-description">{i18n.language === 'en' && service.title_en ? service.title_en : service.title}</p>
                        <hr />
                        <h3>{t('service_detail_des')}</h3>
                        <div className="detail-text" dangerouslySetInnerHTML={{ __html: i18n.language === 'en' && service.description_en ? service.description_en : service.description }}></div>
                        <div className="cta-box">
                            <p>{t('service_detail_interested')}</p>
                            <Link to="/contact" className="cta-button">{t('service_detail_button_contact')}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
