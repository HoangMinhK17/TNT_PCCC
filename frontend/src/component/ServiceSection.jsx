import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ServiceSection.css';
import { services } from '../data/services';

const ServiceSection = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;

  // Calculate current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section id="services" className="services-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Dịch vụ của chúng tôi</h2>
        <p className="section-subtitle">Cung cấp giải pháp phòng chữa cháy toàn diện cho mọi loại công trình</p>

        <div className="services-grid">
          {currentServices.map(service => (
            <div key={service.id} className="service-card">
              <Link to={`/services/${service.id}`} className="service-image-link">
                <div className="service-image-wrapper">
                  <img src={service.image} alt={service.title} className="service-image" />
                </div>
              </Link>
              <h3 className="service-title">
                <Link to={`/services/${service.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {service.title}
                </Link>
              </h3>
              {/* Description removed as per user request */}
              <Link to={`/contact`} className="service-link">Liên hệ</Link>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {Math.ceil(services.length / itemsPerPage) > 1 && (
          <div className="pagination">
            {Array.from({ length: Math.ceil(services.length / itemsPerPage) }).map((_, index) => (
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
              <h4>✓ Kinh nghiệm 10+ năm</h4>
              <p>Đã phục vụ hàng ngàn khách hàng lớn nhỏ trên toàn quốc</p>
            </div>
            <div className="highlight-item">
              <h4>✓ Đội ngũ chuyên nghiệp</h4>
              <p>Nhân viên có chứng chỉ PCCC, được đào tạo bài bản</p>
            </div>
            <div className="highlight-item">
              <h4>✓ Giải pháp toàn diện</h4>
              <p>Từ tư vấn, lắp đặt đến bảo dưỡng, kiểu chứng</p>
            </div>
            <div className="highlight-item">
              <h4>✓ Giá cạnh tranh</h4>
              <p>Cung cấp giá tốt nhất trên thị trường với chất lượng đảm bảo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
