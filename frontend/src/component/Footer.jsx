import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">TNT Company</h4>
            <p style={{ color: '#999', fontSize: '14px', marginBottom: '15px', lineHeight: '1.6' }}>
              Giải pháp PCCC toàn diện - An toàn cho mọi công trình.
              Chúng tôi cam kết chất lượng và sự hài lòng tuyệt đối.
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
                📍 : 123 Đường Lê Lợi, Quận 1, TP.HCM
              </li>
              <li className="contact-item">
                📞 : 0912345678
              </li>
              <li className="contact-item">
                ✉️ : info@tntcompany.com
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
