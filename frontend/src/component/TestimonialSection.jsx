import React, { useState, useEffect } from 'react';
import '../styles/TestimonialSection.css';

const TestimonialSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Anh Trần Hoàng',
      role: 'Giám đốc dự án',
      company: 'Tập đoàn ABC',
      content: 'Chất lượng thiết bị PCCC của TNT rất đảm bảo. Đội ngũ kỹ thuật viên nhiệt tình, tư vấn chuyên sâu mang lại giải pháp thi công tối ưu nhất cho công trình của chúng tôi.',
      rating: 5,
      avatar: 'https://via.placeholder.com/100?text=TH'
    },
    {
      id: 2,
      name: 'Chị Nguyễn Mai Anh',
      role: 'Quản lý tòa nhà',
      company: 'Chung cư Blue Star',
      content: 'Công tác bảo trì hệ thống PCCC do TNT thực hiện rất chuyên nghiệp và nhanh chóng. Chúng tôi hoàn toàn yên tâm về an toàn cháy nổ của tòa nhà.',
      rating: 5,
      avatar: 'https://via.placeholder.com/100?text=MA'
    },
    {
      id: 3,
      name: 'Anh Lê Minh',
      role: 'Trưởng phòng Hành chính',
      company: 'Công ty Sản xuất XYZ',
      content: 'Từ khâu báo giá đến thi công lắp đặt, TNT PCCC đều làm việc rất minh bạch và đúng cam kết. Rất đáng để hợp tác lâu dài.',
      rating: 5,
      avatar: 'https://via.placeholder.com/100?text=LM'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="testimonial-section">
      <div className="container">
        <h2 className="section-title">Khách Hàng Nói Gì Về Chúng Tôi</h2>
        <p className="section-subtitle">Niềm tin của khách hàng là thước đo thành công của TNT PCCC</p>
        
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
                <img src={testimonial.avatar} alt={testimonial.name} className="author-avatar" />
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
