import React, { useState, useEffect } from 'react';
import { getPartners } from '../utils/partnerApi';
import '../styles/PartnersSection.css';

const PartnersSection = () => {
  const [partners, setPartners] = useState([]);

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

  return (
    <section className="partners-section">
      <div className="container">
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
