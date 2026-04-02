import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/ProductSection.css';
import SEO from '../component/SEO';
import { getPublicProducts, getPublicProductByCategoryId, getProductByName } from '../utils/productApi';
import { getCategoryProducts } from '../utils/categoryProductApi';

const Product = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const categoryIdParam = searchParams.get('categoryId');
  const searchQueryParam = searchParams.get('search');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'Tất cả sản phẩm');
  const [searchTerm, setSearchTerm] = useState(searchQueryParam || '');
  const [activeSearchTerm, setActiveSearchTerm] = useState(searchQueryParam || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategoryProducts();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
      
    };
    fetchCategories();
  }, []);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;

        if (activeSearchTerm) {
          response = await getProductByName(activeSearchTerm, currentPage, productsPerPage);
          setProducts(response.products || []);
          setTotalPages(response.totalPages || 1);
        } else if (categoryIdParam && categoryIdParam !== 'all') {
          response = await getPublicProductByCategoryId(categoryIdParam, currentPage, productsPerPage);
          setProducts(response.products || []);
          setTotalPages(response.totalPages || 1);
        } else {
          const allProducts = await getPublicProducts();
          setProducts(allProducts || []);
          setTotalPages(1);
        }

        setSelectedCategory(activeSearchTerm ? 'Kết quả tìm kiếm' : (categoryParam || 'Tất cả sản phẩm'));

        if (activeSearchTerm || categoryIdParam) {
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryIdParam, categoryParam, currentPage, activeSearchTerm]);

  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryIdParam, activeSearchTerm, searchQueryParam]);

  useEffect(() => {
    const searchFromUrl = searchQueryParam || '';
    if (searchFromUrl !== activeSearchTerm) {
      setSearchTerm(searchFromUrl);
      setActiveSearchTerm(searchFromUrl);
    }

    const categoryFromUrl = categoryParam || 'Tất cả sản phẩm';
    if (categoryFromUrl !== selectedCategory && !searchQueryParam) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchQueryParam, categoryParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearchTerm(searchTerm);
    if (searchTerm.trim()) {
      setSearchParams({ search: searchTerm.trim() });
    } else {
      if (categoryIdParam) {
        setSearchParams({ category: categoryParam, categoryId: categoryIdParam });
      } else {
        setSearchParams({});
      }
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageTitle = activeSearchTerm
    ? `Tìm kiếm: ${activeSearchTerm} `
    : selectedCategory === 'Tất cả sản phẩm'
      ? 'Danh sách sản phẩm '
      : `${selectedCategory} `;

  const pageDescription = `Cung cấp sản phẩm chất lượng. ${activeSearchTerm ? `Kết quả tìm kiếm cho ${activeSearchTerm}.` : `Xem danh mục ${selectedCategory}.`}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.slice(0, 10).map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${window.location.origin}/products/${product.slug}`,
      "name": product.name,
      "image": product.image[0]
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
        url={activeSearchTerm ? '/products' : `/products?category=${selectedCategory}`}
        schema={structuredData}
      />
      <div className="container" data-aos="fade-up">
        <h1 className="section-title">
          {activeSearchTerm ? `Kết quả cho: "${activeSearchTerm}"` : selectedCategory}
        </h1>

        <div className="products-layout" style={{ flexDirection: 'column' }}>

          <form className="search-box-container" onSubmit={handleSearchSubmit} style={{ marginBottom: '30px', display: 'flex', justifyContent: 'flex-start' }}>
            <div className="search-input-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="sidebar-search-input"
                style={{
                  width: '80%',
                  padding: '12px 60px 12px 25px',
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
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 21L16.65 16.65"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </form>

          <div className="products-content">
            {(selectedCategory === 'Tất cả sản phẩm' || selectedCategory === 'Kết quả tìm kiếm') && !activeSearchTerm ? (
              categories.map((category, index) => {
                const categoryProducts = products.filter(p => p.categoryId?._id === category._id || p.categoryId === category._id);
                if (categoryProducts.length === 0) return null;

                const previewProducts = categoryProducts.slice(0, 4);

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
                      {previewProducts.map(product => (
                        <Link
                          key={product._id}
                          to={`/products/${product.slug}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <article className="product-card">
                            <img src={product.image[0]} alt={product.name} className="product-image" />
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-description">{product.title}</p>
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
                  {products.length > 0 ? (
                    products.map(product => (
                      <Link
                        key={product._id}
                        to={`/products/${product.slug}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <article className="product-card">
                          <img src={product.image[0]} alt={product.name} className="product-image" />
                          <h3 className="product-name">{product.name}</h3>
                          <p className="product-description">{product.title}</p>
                        </article>
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
