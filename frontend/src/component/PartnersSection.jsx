import React, { useState, useEffect } from 'react';
import { getPartners } from '../utils/partnerApi';
import { useThemeSettings } from '../context/ThemeContext';
import '../styles/PartnersSection.css';
import { useTranslation } from 'react-i18next';

const PartnersSection = () => {
  const [partners, setPartners] = useState([]);
  const { themeLayout } = useThemeSettings();
  const variant = themeLayout?.partner || 'logo-grid';
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await getPartners();
        if (Array.isArray(data)) {
          setPartners(data);
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };

    fetchPartners();
  }, []);

  const renderMarquee = () => (
    <div className="partners-carousel-container">
      <div className="partners-carousel">
        {[...partners, ...partners].map((partner, index) => (
          <div key={index} className="partner-item carousel-partner">
            <img src={partner.image} alt={partner.name} className="partner-logo" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderGrid = () => (
    <div className="partners-dynamic-grid">
      {partners.map((partner, index) => (
        <div key={index} className="partner-item static-partner">
          <img src={partner.image} alt={partner.name} className="partner-logo" />
        </div>
      ))}
    </div>
  );

  return (
    <section className={`partners-section variant-${variant}`}>
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">{t('section_partner')}</h2>
        <p className="section-subtitle">{t('section_partner_subtitle')}</p>

        {variant === 'marquee' || variant === 'carousel' ? renderMarquee() : renderGrid()}
      </div>
    </section>
  );
};

export default PartnersSection;
