import { Link } from 'react-router-dom';
import { news } from '../data/news';
import '../styles/NewsSection.css';

const NewsSection = () => {

  return (
    <section id="news" className="news-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Tin tức mới nhất</h2>

        <div className="news-grid">
          {news.slice(0, 4).map(newsItem => (

            <article key={newsItem.id} className="news-card">
              <Link
                to={`/news/${newsItem.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="news-image-wrapper">
                  <img src={newsItem.image} alt={newsItem.title} className="news-image" />
                  <span className="news-category">{newsItem.category}</span>
                </div>

                <div className="news-content">
                  <p className="news-date">🗓️ {newsItem.date}</p>
                  <h3 className="news-title">{newsItem.title}</h3>
                  <p className="news-excerpt">{newsItem.description}</p>
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
