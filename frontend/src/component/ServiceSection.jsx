import React from 'react';
import '../styles/ServiceSection.css';

const ServiceSection = () => {
  const services = [
    {
      id: 1,
      icon: '🚨',
      title: 'Tư vấn Hệ thống PCCC',
      description: 'Tư vấn thiết kế và lắp đặt hệ thống phòng chữa cháy an toàn, tiết kiệm và hiệu quả nhất cho công trình của bạn.'
    },
    {
      id: 2,
      icon: '🔧',
      title: 'Lắp đặt Thiết bị',
      description: 'Dịch vụ lắp đặt chuyên nghiệp các thiết bị chữa cháy như bình chữa cháy, béc phun, hệ thống cảnh báo...'
    },
    {
      id: 3,
      icon: '📋',
      title: 'Kiểm định & Bảo dưỡng',
      description: 'Kiểm định định kỳ và bảo dưỡng hệ thống PCCC theo quy chuẩn để đảm bảo hoạt động an toàn.'
    },
    {
      id: 4,
      icon: '📚',
      title: 'Đào tạo An toàn',
      description: 'Đào tạo kiến thức phòng chữa cháy, cách sử dụng thiết bị và kỹ năng ứng phó sự cố cho nhân viên công ty.'
    },
    {
      id: 5,
      icon: '⚡',
      title: 'Kiểu chứng & Cấp phép',
      description: 'Hỗ trợ hoàn thành các thủ tục kiểu chứng và cấp phép cho hệ thống PCCC từ các cơ quan chức năng.'
    },
    {
      id: 6,
      icon: '📞',
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ hỗ trợ kỹ thuật luôn sẵn sàng giúp đỡ 24/7 để xử lý các tình huống khẩn cấp.'
    }
  ];

  return (
    <section id="services" className="services-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Dịch vụ của chúng tôi</h2>
        <p className="section-subtitle">Cung cấp giải pháp phòng chữa cháy toàn diện cho mọi loại công trình</p>

        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <a href="#contact" className="service-link">Tìm hiểu thêm →</a>
            </div>
          ))}
        </div>

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
