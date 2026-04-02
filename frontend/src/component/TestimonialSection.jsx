import React, { useState, useEffect } from 'react';
import '../styles/TestimonialSection.css';
import { getPublicTestimonials } from '../utils/testimonialApi';
import { getInformation } from '../utils/informationApi';
import { useThemeSettings } from '../context/ThemeContext';

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [getInfor, setGetInfor] = useState([]);
  const { userTheme } = useThemeSettings();

  useEffect(() => {
    const fetchTestimonials = async () => {
      const response = await getPublicTestimonials();
      setTestimonials(response.testimonials || []);
      const infor = await getInformation();
      setGetInfor(Array.isArray(infor) ? infor : []);
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (userTheme === 'ai-teal') return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds
    return () => clearInterval(interval);
  }, [testimonials.length, userTheme]);

  if (userTheme === 'ai-teal') {
    return (
      <section className="testimonial-section theme-ai">
        <div className="container" data-aos="fade-up">
          <div className="text-center ai-header-container">
            <h2 className="ai-title">
              Khách hàng nói gì <span className="highlight-text">về {getInfor[0]?.name || 'Chúng Tôi'}</span>
            </h2>
          </div>

          <div className="testimonial-ai-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-ai-card">
                <div className="ai-card-header">
                  <div className="ai-avatar-wrapper">
                    {testimonial.avatar ? (
                      <img src={testimonial.avatar} alt={testimonial.name} className="ai-author-avatar" />
                    ) : (
                      <div className="ai-avatar-placeholder">
                        <span className="ai-avatar-initial">
                          {testimonial.name?.charAt(0) || 'A'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ai-author-info">
                    <h4 className="ai-author-name">{testimonial.name}</h4>
                    <p className="ai-author-role">{testimonial.role} {testimonial.company ? `- ${testimonial.company}` : ''}</p>
                  </div>
                </div>
                <div className="ai-card-rating">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <div className="ai-card-content">
                  <p className="ai-card-text">{testimonial.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonial-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Khách Hàng Nói Gì Về Chúng Tôi</h2>
        <p className="section-subtitle">Niềm tin của khách hàng là thước đo thành công của {getInfor[0]?.name}</p>

        <div className="testimonial-slider">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`testimonial-item ${index === currentIndex ? 'active' : ''}`}
            >
              <div className="testimonial-content-wrapper">
                <div className="testimonial-quote-icon">❝</div>
                <p className="testimonial-text">{testimonial.content}</p>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
              </div>
              <div className="testimonial-author">
                {testimonial.avatar && <img src={testimonial.avatar} className="author-avatar" alt={testimonial.name} />}
                <div className="author-info">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <p className="author-role">{testimonial.role} - <span>{testimonial.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
