import React, { useState } from 'react';
import '../styles/NewsSection.css';

const NewsSection = () => {
  const [news] = useState([
    {
      id: 1,
      title: 'Quy định mới về an toàn PCCC cho nhà cao tầng 2026',
      date: '08/02/2026',
      category: 'Pháp luật',
      image: 'src/uploads/tnt.jpg', // Using existing image as placeholder
      excerpt: 'Bộ Xây dựng và Bộ Công an vừa ban hành thông tư liên tịch mới quy định chi tiết về tiêu chuẩn PCCC.',
      content: 'Nội dung chi tiết về quy định PCCC mới...'
    },
    {
      id: 2,
      title: 'Hoàn thành nghiệm thu hệ thống PCCC Keangnam',
      date: '05/02/2026',
      category: 'Dự án',
      image: 'src/uploads/tnt.jpg',
      excerpt: 'TNT Company chính thức bàn giao hệ thống báo cháy thông minh cho tòa nhà Keangnam Hà Nội.',
      content: 'Chi tiết lễ bàn giao...'
    },
    {
      id: 3,
      title: 'Tập huấn kỹ năng thoát hiểm cho cư dân Vinhomes',
      date: '02/02/2026',
      category: 'Hoạt động',
      image: 'src/uploads/tnt.jpg',
      excerpt: 'Buổi diễn tập phương án chữa cháy và cứu nạn cứu hộ diễn ra thành công tốt đẹp với sự tham gia của 500 cư dân.',
      content: 'Nội dung buổi diễn tập...'
    }
  ]);

  return (
    <section id="news" className="news-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Tin tức mới nhất</h2>

        <div className="news-grid">
          {news.map(newsItem => (
            <article key={newsItem.id} className="news-card">
              <div className="news-image-wrapper">
                <img src={newsItem.image} alt={newsItem.title} className="news-image" />
                <span className="news-category">{newsItem.category}</span>
              </div>

              <div className="news-content">
                <p className="news-date">🗓️ {newsItem.date}</p>
                <h3 className="news-title">{newsItem.title}</h3>
                <p className="news-excerpt">{newsItem.excerpt}</p>
                <a href="#" className="btn-read-more">Đọc thêm →</a>
              </div>
            </article>
          ))}
        </div>

        <div className="view-all-news">
          <button className="btn-primary">Xem tất cả tin tức</button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
