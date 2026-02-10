import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <section className="search-bar-section">
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
          <button type="submit" className="search-btn">
            <i className="icon-search">🔍</i>
          </button>
        </form>
      </div>
    </section>
  );
};

export default SearchBar;
