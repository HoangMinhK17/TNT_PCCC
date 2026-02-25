import React, { useState, useEffect } from 'react';
import '../styles/Achievements.css';
import { getCoreValues } from '../utils/introductApi';

const Achievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                setLoading(true);
                const response = await getCoreValues();
        
                const data = Array.isArray(response) ? (response[0]?.coreValues ?? []) : (response?.coreValues ?? []);
                setAchievements(data);
            } catch (error) {
                console.error("Error fetching achievements:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
    }, []);

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <section className="achievements-section">
            <div className="container">
                <h2 className="section-title text-center" data-aos="fade-up">Thành Tựu Của Chúng Tôi</h2>

                <div className="achievements-grid">
                    {achievements.map((item, index) => (
                        <div key={index} className="achievement-card" data-aos="fade-up" data-aos-delay={index * 100}>
                            <div className="achievement-image-wrapper">
                                <img src={item.image} alt={item.title} className="achievement-image" />
                            </div>
                            <div className="achievement-year">{item.date}</div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achievements;
