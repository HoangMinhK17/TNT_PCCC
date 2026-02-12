import React, { useState, useEffect } from 'react';
import '../styles/SearchBar.css';
import bg1 from '../uploads/information/gthdoanhnghiep.jpg';
import bg2 from '../uploads/project/prj1.jpg';
import bg3 from '../uploads/project/prj2.jpg';
import bg4 from '../uploads/project/prj3.jpg';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgrounds = [bg1, bg2, bg3, bg4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgrounds.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <section className="search-bar-section">
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className={`search-background ${index === currentImageIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${bg})` }}
        />
      ))}
      <div className="search-overlay"></div>

      <div className="search-container">
        <h2>TNT Company - Chuyên Gia PCCC</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, dịch vụ..."
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
