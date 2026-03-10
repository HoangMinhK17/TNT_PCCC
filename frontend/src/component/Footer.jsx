import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { getInformation } from '../utils/informationApi';

const Footer = () => {
  const [information, setInformation] = useState({});

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
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">{information?.name}</h4>
            <p style={{ color: '#999', fontSize: '14px', marginBottom: '15px', lineHeight: '1.6' }}>
              {information?.title}
            </p>
            <ul className="footer-list">
              <li><Link to="/about">Giới thiệu</Link></li>
              <li><Link to="/services">Dịch vụ</Link></li>
              <li><Link to="/projects">Dự án</Link></li>
              <li><Link to="/news">Tin tức</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Sản phẩm</h4>
            <ul className="footer-list">
              <li><Link to="/products">Danh sách sản phẩm</Link></li>
              <li><Link to="/services">Dịch vụ tư vấn</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Hỗ trợ</h4>
            <ul className="footer-list">
              <li><Link to="/contact">Liên hệ chúng tôi</Link></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
              <li><a href="#">Hướng dẫn sử dụng</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Liên hệ</h4>
            <ul className="footer-list">
              <li className="contact-item">
                <span className="icon"><FaMapMarkerAlt /></span>
                <span>{information?.address}</span>
              </li>
              <li className="contact-item">
                <span className="icon"><FaPhoneAlt /></span>
                <span>{information?.phone}</span>
              </li>
              <li className="contact-item">
                <span className="icon"><FaEnvelope /></span>
                <span>{information?.email}</span>
              </li>

            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; 2026 TNT Company. Tất cả các quyền được bảo lưu.
          </p>
          <ul className="footer-links">
            <li><a href="#">Điều khoản sử dụng</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Chính sách cookies</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
