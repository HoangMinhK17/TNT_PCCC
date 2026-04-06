import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';
import { getImageInformation } from '../utils/informationApi';
import { useThemeSettings } from '../context/ThemeContext';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const [imageInformation, setImageInformation] = useState([]);
  const [name, setName] = useState('');
  const { userTheme } = useThemeSettings();

  useEffect(() => {
    const fetchImageInformation = async () => {
      try {
        const res = await getImageInformation();

        const obj = Array.isArray(res) ? res[0] : res;
        const imgs = obj?.backgroundImage;
        const name = obj?.name;

        setName(name);
        setImageInformation(Array.isArray(imgs) ? imgs : []);
      } catch (e) {
        console.error(e);
        setImageInformation([]);
      }
    };
    fetchImageInformation();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageInformation.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [imageInformation.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const isAI = userTheme === 'ai-teal';

  if (isAI) {
    return (
      <section className="ai-hero-section">
        <div className="ai-hero-bg" />

        <div className="ai-hero-blob ai-hero-blob--left" />
        <div className="ai-hero-blob ai-hero-blob--right" />
        <div className="ai-hero-blob ai-hero-blob--bottom" />

        <div className="ai-hero-content">
          <h1 className="ai-hero-headline">
            <span className="ai-hero-brand">{name}</span>
          </h1>

          <div className="ai-hero-ctas">
            <form onSubmit={handleSearch} className="ai-hero-search-form">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ai-hero-search-input"
              />
              <button type="submit" className="ai-hero-search-btn" aria-label="Search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {imageInformation.length > 0 && (
          <div className="ai-hero-image-strip">
            <div
              className="ai-hero-mockup-img"
              style={{ backgroundImage: `url(${imageInformation[currentImageIndex]})` }}
            />
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="search-bar-section">
      {imageInformation.map((image, index) => (
        <div
          key={index}
          className={`search-background ${index === currentImageIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      <div className="search-overlay"></div>

      <div className="search-container">
        <h1 className="search-title">{name}</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" aria-label="Search">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="search-icon-svg"
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
        </form>
      </div>
    </section>
  );
};

export default SearchBar;
