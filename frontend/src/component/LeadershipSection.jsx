import React, { useEffect, useState } from 'react';
import '../styles/LeadershipSection.css';
import { getAllLeaders } from '../utils/leaderApi';
import { useThemeSettings } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const LeadershipSection = () => {

  const [getLeaders, setLeaders] = useState([]);
  const { themeLayout } = useThemeSettings();
  const variant = themeLayout?.leader || 'grid-carousel';
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchLeaders = async () => {
      const response = await getAllLeaders();
      setLeaders(response);
    };
    fetchLeaders();
  }, []);

  const renderCarousel = () => (
    <div className="leadership-carousel-container">
      <div className="leadership-carousel">
        {[...getLeaders, ...getLeaders].map((leader, index) => (
          <div key={`${leader.id || leader._id || index}-${index}`} className="leader-card carousel-leader">
            <div className="leader-image-wrapper">
              <img src={leader.image} className="leader-image" alt={leader.name} />
            </div>
            <div className="leader-info">
              <h3 className="leader-name">{i18n.language === 'en' && leader.name_en ? leader.name_en : leader.name}</h3>
              <p className="leader-position">{i18n.language === 'en' && leader.position_en ? leader.position_en : leader.position}</p>
              <div className="leader-divider"></div>
              <p className="leader-description">{i18n.language === 'en' && leader.description_en ? leader.description_en : leader.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGrid = () => (
    <div className="leadership-dynamic-grid">
      {getLeaders.map((leader, index) => (
        <div key={leader.id || leader._id || index} className="leader-card grid-leader">
          <div className="leader-image-wrapper">
            <img src={leader.image} className="leader-image" alt={leader.name} />
          </div>
          <div className="leader-info">
            <h3 className="leader-name">{i18n.language === 'en' && leader.name_en ? leader.name_en : leader.name}</h3>
            <p className="leader-position">{i18n.language === 'en' && leader.position_en ? leader.position_en : leader.position}</p>
            <div className="leader-divider"></div>
            <p className="leader-description">{i18n.language === 'en' && leader.description_en ? leader.description_en : leader.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className={`leadership-section variant-${variant}`}>
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">{t('section_leadership')}</h2>
        <p className="section-subtitle">{t('section_leadership_subtitle')}</p>

        {variant === 'grid-carousel' || variant === 'carousel' ? renderCarousel() : renderGrid()}
      </div>
    </section>
  );
};

export default LeadershipSection;
