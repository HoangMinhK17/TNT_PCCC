import React, { useState, useEffect } from 'react';
import '../styles/CompanyIntro.css';

const CompanyIntro = () => {
  const images = [
    "src/uploads/information/gthdoanhnghiep.jpg",
    "src/uploads/tnt.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="about" className="company-intro-section">
      <div className="container">
        <div className="company-intro-content">
          <div className="company-text" data-aos="fade-up"> 
            <h2 className="section-title">Về TNT Company - Chuyên Gia PCCC</h2>
            <p className="company-description">
              TNT Company là đơn vị hàng đầu trong lĩnh vực <strong>Tư vấn, Thiết kế, Thi công và Lắp đặt hệ thống Phòng cháy chữa cháy</strong>.
              Chúng tôi cam kết mang đến giải pháp an toàn tối ưu, bảo vệ tính mạng và tài sản cho mọi công trình.
            </p>
            <p className="company-description">
              Với đội ngũ kỹ sư giàu kinh nghiệm và quy trình làm việc chuẩn ISO, chúng tôi tự hào là đối tác tin cậy
              của nhiều tập đoàn lớn và các dự án trọng điểm quốc gia. Sự an toàn của bạn là sứ mệnh của chúng tôi.
            </p>
          </div>

          <div className="company-image" data-aos="fade-up">
            <img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt="Công ty PCCC TNT"
              className="intro-image fade-in"
            />
          </div>
        </div>

        <div className="company-stats">
          <div className="stat-item">
            <h3 className="stat-number">10+</h3>
            <p className="stat-label">Năm kinh nghiệm PCCC</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">500+</h3>
            <p className="stat-label">Dự án đã thẩm duyệt</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">100%</h3>
            <p className="stat-label">Đạt chuẩn ISO/TCVN</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">24/7</h3>
            <p className="stat-label">Hỗ trợ kỹ thuật</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyIntro;
