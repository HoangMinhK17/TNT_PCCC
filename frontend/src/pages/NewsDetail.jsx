import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { news } from '../data/news';
import '../styles/NewsDetail.css';

const NewsDetail = () => {
    const { id } = useParams();
    const [newsItem, setNewsItem] = useState(null);

    useEffect(() => {
        const foundNews = news.find(n => n.id === parseInt(id));
        if (foundNews) {
            setNewsItem(foundNews);
            window.scrollTo(0, 0);
        }
    }, [id]);

    if (!newsItem) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <h2>Không tìm thấy tin tức</h2>
                <Link to="/news" className="btn-back">Quay lại danh sách</Link>
            </div>
        );
    }

    return (
        <section className="news-detail-section">
            <div className="container">
                <div className="news-detail-container">
                    <div className="news-detail-image-wrapper">
                        <img src={newsItem.image} alt={newsItem.title} className="news-detail-image" />
                    </div>

                    <div className="news-detail-info">
                        <span className="news-detail-category">{newsItem.category}</span>
                        <h1 className="news-detail-title">{newsItem.title}</h1>
                        <p className="news-detail-date">📅 {newsItem.date}</p>

                        <div className="news-detail-content">
                            <p className="news-detail-description">{newsItem.description}</p>
                            <div className="news-detail-body">
                                <p>{newsItem.content}</p>
                            </div>
                        </div>

                        <div className="news-detail-footer">
                            <Link to="/news" className="btn-back">Quay lại danh sách</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsDetail;
