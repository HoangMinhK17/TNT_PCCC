import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ServiceSection.css';
import { getPublicServices } from '../utils/serviceApi';
import { getWhyChooseService } from '../utils/whyChooseServiceApi';

const ServiceSection = () => {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [whyChooseService, setWhyChooseService] = React.useState([]);

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
        console.log("Why choose service:", response);
        setWhyChooseService(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching why choose service:", error);
      }
    };
    fetchWhyChooseService();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section id="services" className="services-section">
      <div className="container" data-aos="fade-up">
        <h1 className="section-title">Dịch vụ của chúng tôi</h1>
        <p className="section-subtitle">Cung cấp giải pháp phòng chữa cháy toàn diện cho mọi loại công trình</p>

        <div className="services-grid">
          {loading ? (
            <div style={{ textAlign: 'center', width: '100%', padding: '20px' }}>Đang tải dịch vụ...</div>
          ) : services.length > 0 ? (
            services.map(service => (
              <div key={service._id} className="service-card">
                <Link to={`/services/${service.slug}`} className="service-image-link">
                  <div className="service-image-wrapper">
                    <img src={service.image} alt={service.title} className="service-image" />
                  </div>
                </Link>
                <h3 className="service-title">
                  <Link to={`/services/${service.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {service.name}
                  </Link>
                </h3>
                <Link to={`/contact`} className="service-link">Liên hệ</Link>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', width: '100%', padding: '20px' }}>Không có dịch vụ nào.</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        <div className="service-highlight">
          <h3>Tại sao chọn dịch vụ của chúng tôi?</h3>
          <div className="highlight-grid">
            {whyChooseService.map((item, index) => (
              <div key={index} className="highlight-item">
                <div className="highlight-icon">
                  <img src={item.icon} alt={item.title} />
                </div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
