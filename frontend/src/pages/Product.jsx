import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductSection.css';

import { products } from '../data/products';

const Product = () => {
  // Use imported products directly
  const categories = ['Tất cả', 'Thiết bị chữa cháy', 'Hệ thống báo cháy', 'Bảo hộ lao động'];

  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

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

        <div className="products-layout">

          <aside className="products-sidebar">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="sidebar-search-input"
              />
            </div>

            <div className="category-list">
              <h3>Danh mục</h3>
              <ul>
                {categories.map((cat, index) => (
                  <li
                    key={index}
                    className={selectedCategory === cat ? 'active' : ''}
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="products-content">
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default Product;