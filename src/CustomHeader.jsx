import React, { useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import './CustomHeader.css';

const CustomHeader = ({ column, onFilterChange }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [filterText, setFilterText] = useState('');

  const handleSearchIconClick = () => {
    setShowSearch(!showSearch);
    setFilterText('');
    onFilterChange(column.id, '');
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    onFilterChange(column.id, e.target.value);
  };

  return (
    <div className="custom-header">
      <span>{column.name}</span>
      <div className="search-container">
        {showSearch && (
          <input 
            type="text" 
            value={filterText} 
            onChange={handleFilterChange} 
            placeholder={`Search ${column.name}`} 
            className="search-input"
          />
        )}
        <IoSearch onClick={handleSearchIconClick} className="search-icon" />
      </div>
    </div>
  );
};

export default CustomHeader;
