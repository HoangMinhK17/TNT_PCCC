import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { getInformation } from '../utils/informationApi';
import { getThemeFooter } from '../utils/themeFooterApi';

const Footer = () => {
  const [information, setInformation] = useState({});
  const [themeFooter, setThemeFooter] = useState(null);

  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const response = await getInformation();
        setInformation(Array.isArray(response) ? response[0] || {} : response || {});
      } catch (error) {
        console.error("Error fetching information:", error);
      }
    };
    const fetchTheme = async () => {
      try {
        const response = await getThemeFooter();
        setThemeFooter(response);
      } catch (error) {
        console.error("Error fetching theme footer:", error);
      }
    };
    fetchInformation();
    fetchTheme();
  }, []);
  return (
    <>
      {themeFooter && (
        <style>
          {`
            .footer {
              background-color: ${themeFooter.background_color || '#000'} !important;
            }
            .footer .footer-title {
              color: ${themeFooter.text_title?.text_color || '#fff'} !important;
              font-size: ${themeFooter.text_title?.text_size || '18px'} !important;
            }
            .footer .footer-section p {
              color: ${themeFooter.text_p?.text_color || '#999'} !important;
              font-size: ${themeFooter.text_p?.text_size || '14px'} !important;
            }
            .footer .footer-list li a {
              color: ${themeFooter.text_a?.text_color || '#fff'} !important;
              font-size: ${themeFooter.text_a?.text_size || '14px'} !important;
            }
            .footer .contact-item .icon {
              color: ${themeFooter.icon_color || '#fff'} !important;
            }
            .footer .contact-item span:not(.icon) {
              color: ${themeFooter.contact_text?.text_color || '#fff'} !important;
              font-size: ${themeFooter.contact_text?.text_size || '14px'} !important;
            }
          `}
        </style>
      )}
      <footer className="footer">
        <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">{information?.name}</h4>
            <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
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


      </div>
      </footer>
    </>
  );
};

export default Footer;
