import React, { useEffect, useState } from 'react';
import '../styles/LeadershipSection.css';
import { getAllLeaders } from '../utils/leaderApi';

const LeadershipSection = () => {


  const [getLeaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      const response = await getAllLeaders();
      setLeaders(response);
    };
    fetchLeaders();
  }, []);

  return (
    <section className="leadership-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Lãnh Đạo Công Ty</h2>
        <p className="section-subtitle">Đội ngũ ban lãnh đạo giàu kinh nghiệm, tận tâm và chuyên nghiệp</p>
        
        <div className="leadership-grid">
          {getLeaders.map(leader => (
            <div key={leader.id} className="leader-card">
              <div className="leader-image-wrapper">
                <img src={leader.image} className="leader-image" />
              </div>
              <div className="leader-info">
                <h3 className="leader-name">{leader.name}</h3>
                <p className="leader-position">{leader.position}</p>
                <div className="leader-divider"></div>
                <p className="leader-description">{leader.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
