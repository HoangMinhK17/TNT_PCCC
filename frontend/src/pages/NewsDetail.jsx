import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/NewsDetail.css';
import SEO from '../component/SEO';
import { getNewsById } from '../utils/newsApi';
import { useTranslation } from 'react-i18next';

const NewsDetail = () => {
    const { id } = useParams();
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                setLoading(true);
                const data = await getNewsById(id);
                setNewsItem(data);
                window.scrollTo(0, 0);
            } catch (error) {
                console.error("Error fetching news detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNewsDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="container" style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="loading">Đang tải...</div>
            </div>
        );
    }

    if (!newsItem) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <h2>Không tìm thấy tin tức</h2>
                <Link to="/news" className="btn-back">Quay lại danh sách</Link>
            </div>
        );
    }

    const plainDescription = newsItem.description ? newsItem.description.replace(/<[^>]*>?/gm, "") : "";

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": newsItem.name,
        "description": plainDescription,
        "image": newsItem.image,
        "datePublished": newsItem.date,
        "author": { "@type": "Organization", "name": "" }
    };

    return (
        <section className="news-detail-section">
            <SEO
                title={newsItem.name}
                description={plainDescription}
                keywords={`${newsItem.categoryNewsId?.name || ''}, tin tức `}
                image={newsItem.image}
                url={`/news/${newsItem._id}`}
                type="article"
                schema={structuredData}
            />
            <div className="container">
                <div className="news-detail-container">
                    <div className="news-detail-image-wrapper">
                        <img src={newsItem.image} alt={newsItem.name} className="news-detail-image" />
                    </div>

                    <div className="news-detail-info">
                        <span className="news-detail-category">{i18n.language === 'en' && newsItem.categoryNewsId?.name_en ? newsItem.categoryNewsId?.name_en : newsItem.categoryNewsId?.name}</span>
                        <h1 className="news-detail-title">{i18n.language === 'en' && newsItem.name_en ? newsItem.name_en : newsItem.name}</h1>
                        <p className="news-detail-date"> {new Date(newsItem.date).toLocaleDateString('vi-VN')}</p>

                        <div className="news-detail-content">
                            <p className="news-detail-description" style={{ fontWeight: '600', marginBottom: '10px' }}>{i18n.language === 'en' && newsItem.title_en ? newsItem.title_en : newsItem.title}</p>
                            <div className="news-detail-short-desc" style={{ color: '#555', marginBottom: '20px', fontStyle: 'italic' }} dangerouslySetInnerHTML={{ __html: i18n.language === 'en' && newsItem.description_en ? newsItem.description_en : newsItem.description }}></div>
                        </div>

                        <div className="news-detail-footer">
                            <Link to="/news" className="btn-back">{t('news_detail_button_back')}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsDetail;
