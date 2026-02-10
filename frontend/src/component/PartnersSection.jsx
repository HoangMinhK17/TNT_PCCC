import React, { useState } from 'react';
import '../styles/PartnersSection.css';

const PartnersSection = () => {
  const [partners] = useState([
    { id: 1, name: 'VinGroup', logo: 'src/uploads/Partner/pn1.jpg' },
    { id: 2, name: 'SunGroup', logo: 'src/uploads/Partner/pn2.jpg' },
    { id: 3, name: 'KCN VSIP', logo: 'src/uploads/Partner/pn3.jpg' },
    { id: 4, name: 'Cảnh sát PCCC', logo: 'src/uploads/Partner/pn4.jpg' },
    { id: 5, name: 'Novaland', logo: 'src/uploads/Partner/pn5.jpg' },
    { id: 6, name: 'Aeon Mall', logo: 'src/uploads/Partner/pn6.jpg' },
    { id: 7, name: 'Viettel', logo: 'src/uploads/Partner/pn7.jpg' },
    { id: 8, name: 'Samsung Bac Ninh', logo: 'src/uploads/Partner/pn8.jpg' }
  ]);

  return (
    <section className="partners-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Đối tác & Khách hàng</h2>
        <p className="section-subtitle">Chúng tôi tự hào được hợp tác với các công ty hàng đầu</p>

        <div className="partners-carousel-container">
          <div className="partners-carousel">
            {[...partners, ...partners].map((partner, index) => (
              <div key={index} className="partner-item carousel-partner">
                <img src={partner.logo} alt={partner.name} className="partner-logo" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
