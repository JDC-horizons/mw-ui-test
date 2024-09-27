import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000/api/tags';

const Task1: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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
      const response = await fetch(`${API_URL}?tag=${query}`);
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prevSelected) => {
      if (!prevSelected.includes(tag)) {
        return [...prevSelected, tag];
      }
      return prevSelected;
    });
    setSearchTerm('');
    setTags([]);
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

      {selectedTags.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }} className="selected-tags">
          {selectedTags.map((tag, index) => (
            <span key={index} className="search-tag">
              {tag}
              <button
                style={{ marginLeft: '6px' }}
                onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
              >
                ✖
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Task1;
