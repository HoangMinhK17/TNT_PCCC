import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/ProductSection.css'; // Reusing Product styles for consistency
import SEO from '../component/SEO';
import { getNews, getNewsByCategoryId, getNewsBySearch } from '../utils/newsApi';
import { getCategoryNews } from '../utils/categoryNewsApi';

const New = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const categoryIdParam = searchParams.get('categoryId');
    const searchParam = searchParams.get('search');

    const [newsItems, setNewsItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'Tất cả tin tức');
    const [searchTerm, setSearchTerm] = useState(searchParam || '');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategoryNews();
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                let response;

                if (searchParam) {
                    response = await getNewsBySearch(searchParam, currentPage, itemsPerPage);
                    setNewsItems(response.news || []);
                    setTotalPages(response.totalPages || 1);
                    setSelectedCategory(`Kết quả tìm kiếm cho: "${searchParam}"`);
                } else if (categoryIdParam && categoryIdParam !== 'all') {
                    response = await getNewsByCategoryId(categoryIdParam, currentPage, itemsPerPage);
                    setNewsItems(response.news || []);
                    setTotalPages(response.totalPages || 1);
                    setSelectedCategory(categoryParam || 'Danh mục');
                } else {
                    const allNews = await getNews();
                    setNewsItems(allNews || []);
                    setTotalPages(1);
                    setSelectedCategory('Tất cả tin tức');
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [categoryIdParam, categoryParam, currentPage, searchParam]);

    useEffect(() => {
        setSearchTerm(searchParam || '');
    }, [searchParam]);

    useEffect(() => {
        setCurrentPage(1);
    }, [categoryIdParam, categoryParam, searchParam]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (searchTerm.trim()) {
            setSearchParams({ search: searchTerm.trim() });
        } else {
            setSearchParams({});
        }
    };

    const isServerPaginated = (categoryIdParam && categoryIdParam !== 'all') || searchParam;

    const filteredNews = isServerPaginated
        ? newsItems
        : newsItems.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = isServerPaginated
        ? newsItems
        : filteredNews.slice(indexOfFirstItem, indexOfLastItem);

    const finalTotalPages = isServerPaginated
        ? totalPages
        : Math.ceil(filteredNews.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageTitle = selectedCategory === 'Tất cả tin tức'
        ? 'Tin tức & Sự kiện - TNT PCCC'
        : `${selectedCategory} - Tin tức - TNT PCCC`;

    const pageDescription = `Cập nhật tin tức mới nhất về ${selectedCategory === 'Tất cả tin tức' ? 'phòng cháy chữa cháy' : selectedCategory.toLowerCase()} từ TNT PCCC.`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": currentItems.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `${window.location.origin}/news/${item._id}`,
            "name": item.title
        }))
    };

    if (loading) return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="loading">Đang tải...</div>
        </div>
    );

    return (
        <section className="products-section">
            <SEO
                title={pageTitle}
                description={pageDescription}
                url={categoryIdParam ? `/news?category=${selectedCategory}&categoryId=${categoryIdParam}` : '/news'}
                schema={structuredData}
            />
            <div className="container" data-aos="fade-up">
                <h1 className="section-title">
                    {selectedCategory}
                </h1>

                <div className="products-layout" style={{ flexDirection: 'column' }}>

                    <div className="search-box-container" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'flex-start' }}>
                        <form onSubmit={handleSearch} className="search-input-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm tin tức..."
                                id="news-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="sidebar-search-input"
                                style={{
                                    width: '80%',
                                    padding: '12px 25px',
                                    border: '1px solid #ddd',
                                    borderRadius: '50px',
                                    fontSize: '15px',
                                    outline: 'none',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    position: 'absolute',
                                    right: 'calc(20% + 5px)',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: '#df2033ff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '46px',
                                    height: '46px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background 0.3s'
                                }}
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    <div className="products-content">
                        {selectedCategory === 'Tất cả tin tức' && !searchParam ? (
                            categories.map((category, index) => {
                                const categoryItems = newsItems.filter(n => n.categoryNewsId?._id === category._id || n.categoryNewsId === category._id);
                                if (categoryItems.length === 0) return null;

                                const previewItems = categoryItems.slice(0, 3);

                                return (
                                    <div key={category._id || index} className="category-section" style={{ marginBottom: '50px' }}>
                                        <div className="category-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1063b2', paddingBottom: '0px' }}>
                                            <h3 className="product-category-title" style={{ fontSize: '24px', color: '#D32F2F', margin: 0, textTransform: 'uppercase', fontWeight: 700 }}>
                                                {category.name}
                                            </h3>
                                            <button
                                                onClick={() => { setSearchParams({ category: category.name, categoryId: category._id }); }}
                                                style={{ background: 'none', border: 'none', color: '#D32F2F', cursor: 'pointer', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}
                                            >
                                                Xem tất cả
                                            </button>
                                        </div>

                                        <div className="products-grid">
                                            {previewItems.map(item => (
                                                <Link
                                                    key={item._id}
                                                    to={`/news/${item._id}`}
                                                    style={{ textDecoration: "none", color: "inherit" }}
                                                >
                                                    <article className="product-card">
                                                        <img src={item.image} alt={item.title} className="product-image" style={{ height: '220px', objectFit: 'cover' }} />
                                                        <div style={{ padding: '15px' }}>
                                                            <span style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '2px', paddingLeft: '10px' }}>
                                                                {new Date(item.date).toLocaleDateString('vi-VN')}
                                                            </span>
                                                            <h3 className="product-name" style={{ fontSize: '18px', lineHeight: '1.4', marginBottom: '10px' }}>{item.name}</h3>
                                                            <p className="product-description" style={{ fontSize: '14px', color: '#666', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                                {item.title}
                                                            </p>
                                                        </div>
                                                    </article>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <>
                                <div className="products-grid">
                                    {currentItems.length > 0 ? (
                                        currentItems.map(item => (
                                            <Link
                                                key={item._id}
                                                to={`/news/${item._id}`}
                                                style={{ textDecoration: "none", color: "inherit" }}
                                            >
                                                <article className="product-card">
                                                    <img src={item.image} alt={item.title} className="product-image" style={{ height: '220px', objectFit: 'cover' }} />
                                                    <div style={{ padding: '15px' }}>
                                                        <span style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>
                                                            {new Date(item.date).toLocaleDateString('vi-VN')}
                                                        </span>
                                                        <h3 className="product-name" style={{ fontSize: '18px', lineHeight: '1.4', marginBottom: '10px' }}>{item.name}</h3>
                                                        <p className="product-description" style={{ fontSize: '14px', color: '#666', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                            {item.title}
                                                        </p>
                                                    </div>
                                                </article>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="no-products">Không tìm thấy tin tức phù hợp.</p>
                                    )}
                                </div>

                                {finalTotalPages > 1 && (
                                    <div className="pagination">
                                        {Array.from({ length: finalTotalPages }, (_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => paginate(i + 1)}
                                                className={currentPage === i + 1 ? 'active' : ''}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default New;