import React, { useState, useEffect } from 'react';
import '../styles/CompanyIntro.css';
import { getIntroduction } from '../utils/introductApi.js';
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
  const [introduction, setIntroduction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIntroduction = async () => {
      try {
        setLoading(true);
        const response = await getIntroduction();
        setIntroduction(Array.isArray(response) ? (response[0] ?? null) : response);
      } catch (error) {
        console.error("Error fetching introduction:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIntroduction();
  }, []);

const images = introduction?.image || [];
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
            <h1 className="section-title"> {introduction.name}</h1>
            <div className="intro-item">
              <img src="src/uploads/information/icon1.jpg" alt="Icon 1" className="intro-icon" />
              <p className="company-description">
                {introduction.title}
              </p>
            </div>

            <div className="intro-item">
              <img src="src/uploads/information/icon3.jpg" alt="Icon 3" className="intro-icon" />
              <p className="company-description">
                {introduction.description}
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
