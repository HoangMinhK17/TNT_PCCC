import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ServiceSection.css';
import { FaTrophy, FaUserTie, FaTools, FaHandHoldingUsd } from 'react-icons/fa';
import { getPublicServices } from '../utils/serviceApi';

const ServiceSection = () => {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
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
                <Link to={`/services/${service._id}`} className="service-image-link">
                  <div className="service-image-wrapper">
                    <img src={service.image} alt={service.title} className="service-image" />
                  </div>
                </Link>
                <h3 className="service-title">
                  <Link to={`/services/${service._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
            <div className="highlight-item">
              <div className="highlight-icon">
                <FaTrophy />
              </div>
              <h4>Kinh nghiệm 10+ năm</h4>
              <p>Đã phục vụ hàng ngàn khách hàng lớn nhỏ trên toàn quốc</p>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <FaUserTie />
              </div>
              <h4>Đội ngũ chuyên nghiệp</h4>
              <p>Nhân viên có chứng chỉ PCCC, được đào tạo bài bản</p>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <FaTools />
              </div>
              <h4>Giải pháp toàn diện</h4>
              <p>Từ tư vấn, lắp đặt đến bảo dưỡng, kiểm định</p>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <FaHandHoldingUsd />
              </div>
              <h4>Giá cạnh tranh</h4>
              <p>Cung cấp giá tốt nhất trên thị trường với chất lượng đảm bảo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
