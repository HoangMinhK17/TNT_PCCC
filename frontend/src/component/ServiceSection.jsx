import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ServiceSection.css';
import { getPublicServices } from '../utils/serviceApi';
import { getWhyChooseService } from '../utils/whyChooseServiceApi';
import { useThemeSettings } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const  ServiceSection = () => {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [whyChooseService, setWhyChooseService] = React.useState([]);
  const { themeLayout, userTheme } = useThemeSettings();
  const variant = themeLayout?.service || 'card-image';
  const { t, i18n } = useTranslation();

  const itemsPerPage = 4;

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await getPublicServices(currentPage, itemsPerPage);
        setServices(response.services || []);
        setTotalPages(response.totalPages || 1);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [currentPage]);

  React.useEffect(() => {
    const fetchWhyChooseService = async () => {
      try {
        const response = await getWhyChooseService();
        setWhyChooseService(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching why choose service:", error);
      }
    };
    fetchWhyChooseService();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const WhyChooseBlock = () => whyChooseService.length > 0 ? (
    <div className="service-highlight">
      <h3>{t('section_why_choose')}</h3>
      <div className="highlight-grid">
        {whyChooseService.map((item, index) => (
          <div key={index} className="highlight-item">
            <div className="highlight-icon"><img src={item.icon} alt={item.title} /></div>
            <h4>{i18n.language === 'vn' ? item.title : item.title_en}</h4>
            <p>{i18n.language === 'vn' ? item.description : item.description_en}</p>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  const PaginationBlock = () => totalPages > 1 ? (
    <div className="pagination">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => paginate(index + 1)}
          className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
        >{index + 1}</button>
      ))}
    </div>
  ) : null;

  if (variant === 'list') {
    return (
      <section id="services" className="services-section">
        <div className="container" data-aos="fade-up">
          <h1 className="section-title">{t('section_services')}</h1>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', minHeight: '300px' }}>Đang tải...</div>
          ) : (
            <div className="services-list">
              {services.map((service, idx) => (
                <Link key={service._id} to={`/services/${service.slug}`} className="service-list-row">
                  <div className="service-list-row__info">
                    <h3 className="service-list-row__name">{i18n.language === 'vn' ? service.name : service.name_en}</h3>
                    {service.shortDescription && (
                      <p className="service-list-row__desc">{i18n.language === 'vn' ? service.shortDescription : service.shortDescription_en}</p>
                    )}
                  </div>
                  {service.image && (
                    <div className="service-list-row__img">
                      <img src={service.image} alt={service.name} />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
          <PaginationBlock />
          <WhyChooseBlock />
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="services-section">
      <div className="container" data-aos="fade-up">
        <h1 className="section-title">{t('section_services')}</h1>
        <div className="services-grid">
          {loading ? (
            <div style={{ textAlign: 'center', width: '100%', padding: '100px 20px', minHeight: '400px' }}>Đang tải dịch vụ...</div>
          ) : services.length > 0 ? (
            services.map(service => (
              <div key={service._id} className="service-card">
                <Link to={`/services/${service.slug}`} className="service-image-link">
                  <div className="service-image-wrapper">
                    <img src={service.image} alt={service.title} className="service-image" />
                  </div>
                </Link>
                <h3 className="service-title">
                  <Link to={`/services/${service.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}> {i18n.language === 'vn' ? service.name : service.name_en}</Link>
                </h3>
                {userTheme === 'ai-teal' ? (
                  <Link to={`/contact`} className="ai-arrow-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                ) : (
                  <Link to={`/contact`} className="service-link">{t('service_button_contact')}</Link>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', width: '100%', padding: '20px' }}>Không có dịch vụ nào.</div>
          )}
        </div>
        <PaginationBlock />
        <WhyChooseBlock />
      </div>
    </section>
  );
};

export default ServiceSection;
