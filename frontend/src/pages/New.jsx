import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { news } from '../data/news';
import '../styles/ProductSection.css'; // Reusing Product styles for consistency

const New = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');

    const categories = ['Tất cả', ...new Set(news.map(item => item.category))];

    const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'Tất cả');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // articles per page

    // Sync state with URL param
    useEffect(() => {
        window.scrollTo(0, 0);
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        } else {
            setSelectedCategory('Tất cả');
        }
        setCurrentPage(1);
    }, [categoryParam]);

    const filteredNews = news.filter(item => {
        const matchCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
        const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <section className="products-section">
            <div className="container" data-aos="fade-up">
                <h2 className="section-title">Tin tức & Sự kiện</h2>

                <div className="products-layout" style={{ flexDirection: 'column' }}>

                    <div className="search-box" style={{ marginBottom: '30px' }}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm tin tức..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="sidebar-search-input"
                            style={{
                                width: '80%',
                                maxWidth: '400px',
                                padding: '12px 20px',
                                border: '1px solid #ddd',
                                borderRadius: '50px',
                                fontSize: '15px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div className="products-content">
                        {selectedCategory === 'Tất cả' && !searchTerm ? (
                            // Grouped Categories View
                            categories.filter(cat => cat !== 'Tất cả').map((category, index) => {
                                const categoryItems = news.filter(n => n.category === category);
                                if (categoryItems.length === 0) return null;

                                // Show only first 3 items for preview
                                const previewItems = categoryItems.slice(0, 4);

                                return (
                                    <div key={index} className="category-section" style={{ marginBottom: '50px' }}>
                                        <div className="category-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1063b2', paddingBottom: '0px' }}>
                                            <h3 className="product-category-title" style={{ fontSize: '24px', color: '#D32F2F', margin: 0, textTransform: 'uppercase', fontWeight: 700 }}>
                                                {category}
                                            </h3>
                                            <button
                                                onClick={() => { setSearchParams({ category }); }}
                                                style={{ background: 'none', border: 'none', color: '#D32F2F', cursor: 'pointer', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}
                                            >
                                                Xem tất cả <span style={{ fontSize: '18px' }}>&rarr;</span>
                                            </button>
                                        </div>

                                        <div className="products-grid">
                                            {previewItems.map(item => (
                                                <Link
                                                    key={item.id}
                                                    to={`/news/${item.id}`} // Assuming detail page might be added later, or just linking to it
                                                    style={{ textDecoration: "none", color: "inherit" }}
                                                >
                                                    <div className="product-card">
                                                        <img src={item.image} alt={item.title} className="product-image" style={{ height: '200px', objectFit: 'cover' }} />
                                                        <div style={{ padding: '15px' }}>
                                                            <span style={{ fontSize: '12px', color: '#666', marginBottom: '5px', display: 'block' }}>{item.date}</span>
                                                            <h3 className="product-name" style={{ fontSize: '18px', marginBottom: '10px', minHeight: 'auto' }}>{item.title}</h3>
                                                            <p className="product-description" style={{ fontSize: '14px', color: '#555', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            // Filtered Grid View
                            <>
                                <div className="products-grid">
                                    {currentItems.length > 0 ? (
                                        currentItems.map(item => (
                                            <Link
                                                key={item.id}
                                                to={`/news/${item.id}`}
                                                style={{ textDecoration: "none", color: "inherit" }}
                                            >
                                                <div className="product-card">
                                                    <img src={item.image} alt={item.title} className="product-image" style={{ height: '200px', objectFit: 'cover' }} />
                                                    <div style={{ padding: '15px' }}>
                                                        <span style={{ fontSize: '12px', color: '#666', marginBottom: '5px', display: 'block' }}>{item.date}</span>
                                                        <h3 className="product-name" style={{ fontSize: '18px', marginBottom: '10px', minHeight: 'auto' }}>{item.title}</h3>
                                                        <p className="product-description" style={{ fontSize: '14px', color: '#555', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="no-products">Không tìm thấy tin tức phù hợp.</p>
                                    )}
                                </div>

                                {totalPages > 1 && (
                                    <div className="pagination">
                                        {Array.from({ length: totalPages }, (_, i) => (
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