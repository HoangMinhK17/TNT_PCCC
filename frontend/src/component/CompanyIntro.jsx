import React, { useState, useEffect } from 'react';
import '../styles/CompanyIntro.css';
import { getIntroductionCompany } from '../utils/introductApi.js';
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
        const response = await getIntroductionCompany();
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
          <div className="company-text" data-aos="fade-right">
            <h2 className="section-title"> {introduction?.name}</h2>

            <div className="intro-content-wrapper">
              <div className="intro-item">
                <div className="intro-icon-box">
                  <img src={introduction?.title?.titleIcon} alt="Icon 1" className="intro-icon" />
                </div>
                <p className="company-description">
                  {introduction?.title?.titleName}
                </p>
              </div>

              {introduction?.description?.descriptionName?.trim() && (
                <div className="intro-item">
                  <div className="intro-icon-box">
                    <img src={introduction?.description?.descriptionIcon} alt="Icon 3" className="intro-icon" />
                  </div>
                  <p className="company-description">
                    {introduction?.description?.descriptionName}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="company-image-container" data-aos="fade-left">
            <div className="image-decoration"></div>
            <div className="company-image">
              <img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt="Công ty"
                className="intro-image fade-in"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyIntro;
