import React, { useState, useEffect } from 'react';
import '../styles/TestimonialSection.css';
import { getPublicTestimonials } from '../utils/testimonialApi';
import { getInformation } from '../utils/informationApi';

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [getInfor, setGetInfor] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const response = await getPublicTestimonials();
      setTestimonials(response.testimonials);
      const infor = await getInformation();
      setGetInfor(Array.isArray(infor) ? infor : []);
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds
    return () => clearInterval(interval);
  }, [testimonials.length]);

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
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
              </div>
              <div className="testimonial-author">
                <img src={testimonial.avatar} className="author-avatar" />
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
