import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNews } from '../utils/newsApi';
import { useThemeSettings } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import '../styles/NewsSection.css';

const NewsSection = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { themeLayout } = useThemeSettings();
  const variant = themeLayout?.news || 'grid';
  const { t } = useTranslation();

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

  const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');

  // ── Layout: MAGAZINE ──────────────────────────────────────────
  if (variant === 'magazine') {
    const [main, ...rest] = newsItems.slice(0, 5);
    return (
      <section id="news" className="news-section">
        <div className="container" data-aos="fade-up">
          <h2 className="section-title">{t('section_news')}</h2>
          <div className="news-magazine">
            {/* Bài chính lớn */}
            {main && (
              <Link to={`/news/${main.slug}`} className="news-magazine__main">
                <div className="news-magazine__main-img">
                  <img src={main.image} alt={main.name} />
                  <span className="news-category">{main.categoryNewsId?.name}</span>
                </div>
                <div className="news-magazine__main-body">
                  <p className="news-date">{formatDate(main.date)}</p>
                  <h3 className="news-magazine__main-title">{main.name}</h3>
                  <p className="news-excerpt">{main.title}</p>
                </div>
              </Link>
            )}
            {/* bài nhỏ */}
            <div className="news-magazine__side">
              {rest.map(item => (
                <Link key={item._id} to={`/news/${item.slug}`} className="news-magazine__side-item">
                  <div className="news-magazine__side-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="news-magazine__side-body">
                    <span className="news-category-tag">{item.categoryNewsId?.name}</span>
                    <p className="news-date">{formatDate(item.date)}</p>
                    <h4 className="news-magazine__side-title">{item.name}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="view-all-news">
            <Link to="/news" className="btn-primary" style={{ textDecoration: 'none' }}>{t('section_view_all_news')}</Link>
          </div>
        </div>
      </section>
    );
  }

  // ── Layout: LIST ──────────────────────────────────────────────
  if (variant === 'list') {
    return (
      <section id="news" className="news-section">
        <div className="container" data-aos="fade-up">
          <h2 className="section-title">{t('section_news')}</h2>
          <div className="news-list">
            {newsItems.slice(0, 4).map(item => (
              <Link key={item._id} to={`/news/${item.slug}`} className="news-list__item">
                <div className="news-list__img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="news-list__body">
                  <div className="news-list__meta">
                    <span className="news-category-tag">{item.categoryNewsId?.name}</span>
                    <span className="news-date">{formatDate(item.date)}</span>
                  </div>
                  <h3 className="news-list__title">{item.name}</h3>
                  <p className="news-excerpt">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="view-all-news">
            <Link to="/news" className="btn-primary" style={{ textDecoration: 'none' }}>{t('section_view_all_news')}</Link>
          </div>
        </div>
      </section>
    );
  }

  // ── Layout: GRID (default) ────────────────────────────────────
  return (
    <section id="news" className="news-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">{t('section_news')}</h2>
        <div className="news-grid">
          {newsItems.slice(0, 3).map(newsItem => (
            <article key={newsItem._id} className="news-card">
              <Link to={`/news/${newsItem.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="news-image-wrapper">
                  <img src={newsItem.image} alt={newsItem.name} className="news-image" />
                  <span className="news-category">{newsItem.categoryNewsId?.name}</span>
                </div>
                <div className="news-content">
                  <p className="news-date">{formatDate(newsItem.date)}</p>
                  <h3 className="news-title">{newsItem.name}</h3>
                  <p className="news-excerpt">{newsItem.title}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
        <div className="view-all-news">
          <Link to="/news" className="btn-primary" style={{ textDecoration: 'none' }}>{t('section_view_all_news')}</Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
