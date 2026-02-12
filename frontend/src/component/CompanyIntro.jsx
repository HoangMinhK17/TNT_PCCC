import React, { useState, useEffect } from 'react';
import '../styles/CompanyIntro.css';

// Helper component for counting animation
const CountUpNumber = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) observer.unobserve(countRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;

      if (progress < duration) {
        const nextCount = Math.floor((progress / duration) * end);
        setCount(nextCount);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

const CompanyIntro = () => {
  const images = [
    "src/uploads/breadcrumb/nav2.jpg",
    "src/uploads/information/infor.jpg",
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
            <h2 className="section-title"> TNT Company - Chuyên Gia PCCC</h2>
            <div className="intro-item">
              <img src="src/uploads/information/icon1.jpg" alt="Icon 1" className="intro-icon" />
              <p className="company-description">
                TNT Company là đơn vị hàng đầu trong lĩnh vực <strong>Tư vấn, Thiết kế, Thi công và Lắp đặt hệ thống Phòng cháy chữa cháy</strong>.
                Chúng tôi cam kết mang đến giải pháp an toàn tối ưu, bảo vệ tính mạng và tài sản cho mọi công trình.
              </p>
            </div>

            <div className="intro-item">
              <img src="src/uploads/information/icon3.jpg" alt="Icon 3" className="intro-icon" />
              <p className="company-description">
                Với đội ngũ kỹ sư giàu kinh nghiệm và quy trình làm việc chuẩn ISO, chúng tôi tự hào là đối tác tin cậy
                của nhiều tập đoàn lớn và các dự án trọng điểm quốc gia. Sự an toàn của bạn là sứ mệnh của chúng tôi.
              </p>
            </div>
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
            <h3 className="stat-number"><CountUpNumber end={10} suffix="+" /></h3>
            <p className="stat-label">Năm kinh nghiệm PCCC</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number"><CountUpNumber end={500} suffix="+" /></h3>
            <p className="stat-label">Dự án đã thẩm duyệt</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number"><CountUpNumber end={100} suffix="%" /></h3>
            <p className="stat-label">Đạt chuẩn ISO/TCVN</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number"><CountUpNumber end={24} suffix="/7" /></h3>
            <p className="stat-label">Hỗ trợ kỹ thuật</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyIntro;
