import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/ProductSection.css';

import { products } from '../data/products';

const Product = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Use imported products directly
  const categories = ['Tất cả', 'Thiết bị chữa cháy', 'Hệ thống báo cháy', 'Bảo hộ lao động'];

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  // Sync state with URL param
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('Tất cả');
    }
    setCurrentPage(1);
  }, [categoryParam]);

  const filteredProducts = products.filter(product => {
    const matchCategory = selectedCategory === 'Tất cả' || product.category === selectedCategory;
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="products-section">
      <div className="container" data-aos="fade-up">
        <h2 className="section-title">Danh sách sản phẩm </h2>

        <div className="products-layout" style={{ flexDirection: 'column' }}>

          <div className="search-box" style={{ marginBottom: '30px' }}>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
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
                const categoryProducts = products.filter(p => p.category === category);
                if (categoryProducts.length === 0) return null;

                // Show only first 4 items for preview
                const previewProducts = categoryProducts.slice(0, 4);

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
                      {previewProducts.map(product => (
                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <div className="product-card">
                            <img src={product.images[0]} alt={product.name} className="product-image" />
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-description">{product.description}</p>
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
                  {currentProducts.length > 0 ? (
                    currentProducts.map(product => (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <div className="product-card">
                          <img src={product.images[0]} alt={product.name} className="product-image" />
                          <h3 className="product-name">{product.name}</h3>
                          <p className="product-description">{product.description}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="no-products">Không tìm thấy sản phẩm phù hợp.</p>
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

export default Product;