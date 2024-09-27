import React, { useState, useEffect } from 'react';

const apiUrl = 'http://localhost:8000/api/tags';
const carsApiUrl = 'http://localhost:8000/api/cars';

const Task1: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [fetchedCars, setFetchedCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = async (query: string) => {
    if (!query) {
      setTags([]);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}?tag=${query}`);
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setTags(data);
    } catch (err) {
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchTags(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const fetchCars = async (tag: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${carsApiUrl}?tag=${tag}`);
      if (!response.ok) throw new Error('Failed to fetch cars');
      const data = await response.json();
      setFetchedCars(data);
    } catch (err) {
      setError('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setSearchTerm('');
    setTags([]);
    fetchCars(tag);
  };

  return (
    <div className="task1">
      <input
        type="text"
        placeholder="Search tags..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
        autoComplete="off"
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {tags.length > 0 && (
        <ul className="dropdown">
          {tags.map((tag, index) => (
            <li key={index} onClick={() => handleTagSelect(tag)} className="dropdown-item">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {selectedTag && (
        <div className="selected-tag">
          <span className="search-tag">
            {selectedTag}
            <button
              style={{ marginLeft: '8px' }}
              onClick={() => {
                setSelectedTag(null);
                setFetchedCars([]);
              }}
            >
              ✖
            </button>
          </span>
        </div>
      )}

      {fetchedCars.length > 0 && (
        <div className="cars-display">
          {fetchedCars.map((car, index) => (
            <img key={index} className="car-image" src={car.url} alt={`Car ${index}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Task1;
