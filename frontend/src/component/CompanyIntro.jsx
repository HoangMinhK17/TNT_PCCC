import React, { useState, useEffect } from 'react';
import '../styles/CompanyIntro.css';
import { getIntroductionCompany } from '../utils/introductApi.js';
import { useThemeSettings } from '../context/ThemeContext';

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



const AICompanyIntro = ({ introduction, images, currentImageIndex }) => {

  const features = [];
  if (introduction?.title?.titleName?.trim()) {
    features.push({
      id: 'title',
      icon: introduction.title.titleIcon,
      title: introduction.title.titleName,
    });
  }
  if (introduction?.description?.descriptionName?.trim()) {
    features.push({
      id: 'desc',
      icon: introduction.description.descriptionIcon,
      title: introduction.description.descriptionName,
    });
  }

  const [openId, setOpenId] = useState(null);
  useEffect(() => {
    if (features.length > 0 && openId === null) {
      setOpenId(features[0].id);
    }
  }, [features.length]);

  return (
    <section id="about" className="ai-intro-section">
      <div className="ai-intro-blob ai-intro-blob--1" />
      <div className="ai-intro-blob ai-intro-blob--2" />

      <div className="container ai-intro-container">

        <div className="ai-intro-image-pane" data-aos="fade-right">
          <div className="ai-intro-image-circle">
            <div className="ai-intro-image-ring" />
            <div className="ai-intro-image-wrapper">
              {images.length > 0 ? (
                <img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={introduction?.name || 'Giới thiệu'}
                  className="ai-intro-img fade-in"
                />
              ) : (
                <div className="ai-intro-img-placeholder">
                  <span></span>
                </div>
              )}
            </div>
          </div>

          {introduction?.description?.descriptionIcon && (
            <div className="ai-intro-badge ai-intro-badge--br">
              <img src={introduction.description.descriptionIcon} alt="" className="ai-badge-icon-img" />
              <span className="ai-intro-badge__text">{introduction.description.descriptionName?.slice(0, 30)}{introduction.description.descriptionName?.length > 30 ? '…' : ''}</span>
            </div>
          )}
        </div>

        <div className="ai-intro-content-pane" data-aos="fade-left">
          <h2 className="ai-intro-heading">
            <span className="ai-intro-heading--teal">{introduction?.name}</span>
          </h2>

          <div className="ai-intro-features">
            {features.map((feature) => {
              const isOpen = openId === feature.id;
              return (
                <div
                  key={feature.id}
                  className={`ai-feature-item ${isOpen ? 'ai-feature-item--active' : ''}`}
                  onClick={() => setOpenId(isOpen ? null : feature.id)}
                >
                  <div className="ai-feature-header">
                    <div className={`ai-feature-icon-wrap ${isOpen ? 'active' : ''}`}>
                      {feature.icon
                        ? <img src={feature.icon} alt="" className="ai-feature-api-icon" />
                        : <span></span>}
                    </div>
                    <span className="ai-feature-title">{feature.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const DefaultCompanyIntro = ({ introduction, images, currentImageIndex }) => (
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

const CompanyIntro = () => {
  const [introduction, setIntroduction] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userTheme } = useThemeSettings();

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
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (loading) return null;

  const isAI = userTheme === 'ai-teal';

  return isAI
    ? <AICompanyIntro introduction={introduction} images={images} currentImageIndex={currentImageIndex} />
    : <DefaultCompanyIntro introduction={introduction} images={images} currentImageIndex={currentImageIndex} />;
};

export default CompanyIntro;
