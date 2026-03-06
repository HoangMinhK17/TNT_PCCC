import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNews } from '../utils/newsApi';
import '../styles/NewsSection.css';

const NewsSection = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNews();
        setNewsItems(data || []);
      } catch (error) {
        console.error("Error fetching news for section:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return null; 

  return (
    <section id="news" className="news-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Tin tức mới nhất</h2>

        <div className="news-grid">
          {newsItems.slice(0, 3).map(newsItem => (

            <article key={newsItem._id} className="news-card">
              <Link
                to={`/news/${newsItem._id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="news-image-wrapper">
                  <img src={newsItem.image} alt={newsItem.title} className="news-image" />
                  <span className="news-category">{newsItem.categoryNewsId?.name}</span>
                </div>

                <div className="news-content">
                  <p className="news-date"> {new Date(newsItem.date).toLocaleDateString('vi-VN')}</p>
                  <h3 className="news-title">{newsItem.name}</h3>
                  <p className="news-excerpt">{newsItem.title}</p>
                </div>
              </Link>
            </article>

          ))}
        </div>

        <div className="view-all-news">
          <Link to="/news" className="btn-primary" style={{ textDecoration: 'none' }}>Xem tất cả tin tức</Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
