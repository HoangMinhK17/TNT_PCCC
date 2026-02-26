import React, { useState, useEffect } from 'react';
import '../styles/PartnersSection.css';
import { getPartners } from '../utils/partnerApi';

const PartnersSection = () => {
  const [partners, setPartners] = useState([]);

  const fetchPartners = async () => {
    try {
      const partnersData = await getPartners();
      setPartners(partnersData);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <section className="partners-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Đối tác & Khách hàng</h2>
        <p className="section-subtitle">Chúng tôi tự hào được hợp tác với các công ty hàng đầu</p>

        <div className="partners-carousel-container">
          <div className="partners-carousel">
            {[...partners, ...partners].map((partner, index) => (
              <div key={index} className="partner-item carousel-partner">
                <img src={partner.image} alt={partner.name} className="partner-logo" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
