import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import '../styles/ContactSection.css';
import { getInformation } from '../utils/informationApi';
import { createContact } from '../utils/contactApi';
import { toast } from 'react-toastify';

const ContactSection = () => {
  const location = useLocation();
  const { productId, productName, productImage } = location.state || {};

  const [information, setInformation] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: productName ? `Tư vấn sản phẩm: ${productName} ` : '',
    message: '',
    productId: productId || null
  });

  const address = information?.address || "";
  const mapSrc =
    "https://www.google.com/maps?q=" +
    encodeURIComponent(address) +
    "&output=embed";
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContact({
        ...formData
      });
      setSubmitted(true);
      toast.success("Tin nhắn đã được gửi thành công!");
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          title: productName ? `Tư vấn sản phẩm: ${productName}` : '',
          message: '',
          productId: productId || null
        });
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error creating contact:', error);
      toast.error("Có lỗi xảy ra khi gửi tin nhắn!");
    }
  };

  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const response = await getInformation();
        console.log(response);
        setInformation(Array.isArray(response) ? response[0] || {} : response || {});
      } catch (error) {
        console.error("Error fetching information:", error);
      }
    };
    fetchInformation();
  }, []);

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h1 className="section-title" data-aos="fade-up">Liên hệ với chúng tôi</h1>

        <div className="contact-content">
          <div className="contact-form-wrapper" data-aos="fade-up">
            {productName && (
              <div className="product-preview-container">
                <div className="product-preview-info">
                  <span className="product-preview-label">Đang đăng ký mua cho sản phẩm:</span>
                  <h3 className="product-preview-name">{productName}</h3>
                </div>
                {productImage && (
                  <div className="product-preview-image-wrapper">
                    <img src={productImage} alt={productName} className="product-preview-image" />
                  </div>
                )}
              </div>
            )}
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
                <label htmlFor="title">Tiêu đề *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề"
                  readOnly={productName ? true : false}
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
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="info-content">
                  <h4>Địa chỉ</h4>
                  <p>{information.address}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaPhoneAlt />
                </div>
                <div className="info-content">
                  <h4>Điện thoại</h4>
                  <p><a href="tel:0912345678">{information.phone}</a></p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <div className="info-content">
                  <h4>Email</h4>
                  <p><a href={`mailto:${information.email}`}>{information.email}</a></p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaClock />
                </div>
                <div className="info-content">
                  <h4>Giờ làm việc</h4>
                  {information.timeWork?.map((time, index) => (
                    <p key={index}>{time}</p>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="map-section" data-aos="fade-up">
          <h3>Vị trí của chúng tôi</h3>
          <div className="map-container">
            {information.address ? (
              <iframe
                src={mapSrc}
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <div className="map-loading" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                Đang tải bản đồ...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
