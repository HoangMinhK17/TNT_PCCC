import React, { useState } from 'react';
import '../styles/ContactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setSubmitted(false);
    }, 2000);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title" data-aos="fade-up">Liên hệ với chúng tôi</h2>

        <div className="contact-content">
          <div className="contact-form-wrapper" data-aos="fade-up">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Họ và tên *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Tiêu đề *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Nội dung *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nhập nội dung tin nhắn"
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-submit">
                Gửi yêu cầu
              </button>

              {submitted && (
                <div className="success-message">
                   Tin nhắn đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm.
                </div>
              )}
            </form>
          </div>

          <div className="contact-info-wrapper" data-aos="fade-up">
            <div className="contact-info-box">
              <h3>Thông tin liên hệ</h3>

              <div className="info-item">
                <div className="info-content">
                  <h4>Địa chỉ</h4>
                  <p>123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-content">
                  <h4>Điện thoại</h4>
                  <p><a href="tel:0912345678">(+84) 912 345 678</a></p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-content">
                  <h4>Email</h4>
                  <p><a href="mailto:info@tntcompany.com">info@tntcompany.com</a></p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-content">
                  <h4>Giờ làm việc</h4>
                  <p>Thứ Hai - Thứ Sáu: 8:00 - 17:00</p>
                  <p>Thứ Bảy: 9:00 - 12:00</p>
                  <p>Chủ Nhật: Đóng cửa</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="map-section" data-aos="fade-up">
          <h3>Vị trí của chúng tôi</h3>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5123456789!2d106.6966!3d10.7769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f50f1f1f1f1%3A0x1f1f1f1f1f1f1f1f!2s123%20L%C3%AA%20L%E1%BB%A3i%2C%20District%201%2C%20Ho%20Chi%20Minh%20City!5e0!3m2!1sen!2svn!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
