import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductSection.css';

const Product = () => {
  // Defines products locally for this page to have full filtering capabilities
  const [products] = useState([
    {
      id: 1,
      name: 'Bình chữa cháy ABC',
      price: '1,000,000 VND',
      image: 'src/uploads/products/product1.jpg',
      category: 'Thiết bị chữa cháy',
      description: 'Bình bột chữa cháy đa năng'
    },
    {
      id: 2,
      name: 'Hộp cứu hỏa vách tường',
      price: '2,000,000 VND',
      image: 'src/uploads/products/product2.jpg',
      category: 'Thiết bị chữa cháy',
      description: 'Hộp đựng vòi chữa cháy'
    },
    {
      id: 3,
      name: 'Đèn Exit thoát hiểm',
      price: '1,500,000 VND',
      image: 'src/uploads/products/product3.jpg',
      category: 'Hệ thống báo cháy',
      description: 'Đèn chỉ dẫn lối thoát hiểm'
    },
    {
      id: 4,
      name: 'Mặt nạ phòng độc 3M',
      price: '1,800,000 VND',
      image: 'src/uploads/products/product4.jpg',
      category: 'Bảo hộ lao động',
      description: 'Mặt nạ lọc khói độc'
    },
    {
      id: 5,
      name: 'Vòi chữa cháy D50',
      price: '2,200,000 VND',
      image: 'src/uploads/products/product5.jpg',
      category: 'Thiết bị chữa cháy',
      description: 'Vòi rồng áp lực cao'
    },
    {
      id: 6,
      name: 'Đầu báo khói quang',
      price: '1,200,000 VND',
      image: 'src/uploads/products/product6.jpg',
      category: 'Hệ thống báo cháy',
      description: 'Cảm biến khói độ nhạy cao'
    },
    {
      id: 7,
      name: 'Quần áo chịu nhiệt',
      price: '3,500,000 VND',
      image: 'src/uploads/products/product1.jpg', // Placeholder
      category: 'Bảo hộ lao động',
      description: 'Bộ quần áo tráng nhôm chịu nhiệt'
    },
    {
      id: 8,
      name: 'Chuông báo cháy',
      price: '500,000 VND',
      image: 'src/uploads/products/product3.jpg', // Placeholder
      category: 'Hệ thống báo cháy',
      description: 'Chuông báo động âm lượng lớn'
    }
  ]);

  const categories = ['Tất cả', 'Thiết bị chữa cháy', 'Hệ thống báo cháy', 'Bảo hộ lao động'];

  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const matchCategory = selectedCategory === 'Tất cả' || product.category === selectedCategory;
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="products-section">
      <div className="container">
        <h2 className="section-title">Danh sách sản phẩm PCCC</h2>

        <div className="products-layout">
          {/* Sidebar */}
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

          {/* Product Grid */}
          <div className="products-content">
            <div className="products-grid">
              {currentProducts.length > 0 ? (
                currentProducts.map(product => (
                  <Link
                    key={product.id}
                    to={`/`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="product-card">
                      <img src={product.image} alt={product.name} className="product-image" />
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="no-products">Không tìm thấy sản phẩm phù hợp.</p>
              )}
            </div>

            {/* Pagination */}
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