import { Link } from 'react-router-dom';
import { news } from '../data/news';
import '../styles/NewsSection.css';

const NewsSection = () => {

  return (
    <section id="news" className="news-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Tin tức mới nhất</h2>

        <div className="news-grid">
          {news.map(newsItem => (

            <article key={newsItem.id} className="news-card">
              <Link
                key={newsItem.id}
                to={`/news/${newsItem.id}`}>
                <div className="news-image-wrapper">
                  <img src={newsItem.image} alt={newsItem.title} className="news-image" />
                  <span className="news-category">{newsItem.category}</span>
                </div>

                <div className="news-content">
                  <p className="news-date">🗓️ {newsItem.date}</p>
                  <h3 className="news-title">{newsItem.title}</h3>
                  <p className="news-excerpt">{newsItem.excerpt}</p>
                </div>
              </Link>
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
