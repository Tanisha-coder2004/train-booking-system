import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Calendar } from 'lucide-react';
import './SearchBar.scss';

interface SearchBarProps {
  variant?: 'glass' | 'standard';
}

const SearchBar: React.FC<SearchBarProps> = ({ variant = 'standard' }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const today = new Date().toISOString().split('T')[0];
  const [values, setValues] = useState({
    src: searchParams.get('src') || 'New Delhi',
    dest: searchParams.get('dest') || 'Mumbai Central',
    date: searchParams.get('date') || today
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams(values).toString();
    navigate(`/search?${query}`);
  };

  return (
    <form className={`search-bar ${variant}`} onSubmit={handleSearch}>
      <div className="search-inputs">
        <div className="input-group">
          <label><MapPin size={14} /> From</label>
          <input 
            type="text" 
            placeholder="Departure Station" 
            value={values.src}
            onChange={(e) => setValues({...values, src: e.target.value})}
            required
          />
        </div>
        
        <div className="input-group">
          <label><MapPin size={14} /> To</label>
          <input 
            type="text" 
            placeholder="Arrival Station" 
            value={values.dest}
            onChange={(e) => setValues({...values, dest: e.target.value})}
            required
          />
        </div>

        <div className="input-group">
          <label><Calendar size={14} /> Date</label>
          <input 
            type="date" 
            value={values.date}
            onChange={(e) => setValues({...values, date: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="action-wrapper">
        <button type="submit" className="search-btn">
          <Search size={14} />
          <span>Search Trains</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
