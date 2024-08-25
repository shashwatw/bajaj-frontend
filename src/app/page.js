"use client"
import React, { useState } from 'react';

function App() {
  const [apiInput, setApiInput] = useState('{"data":["M","1","334","4","B","a","z"]}');
  const [filteredData, setFilteredData] = useState({});
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      // Validate JSON input
      const parsedData = JSON.parse(apiInput);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error('Invalid JSON format.');
      }

      // Make the API request
      const response = await fetch('https://bajajbackend-y721.onrender.com/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        throw new Error('Error in API request.');
      }

      const data = await response.json();
      // Handle API response
      setFilteredData(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (e) => {
    const options = e.target.options;
    const values = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);

    setSelectedFilters(values);
  };

  // Function to filter the data based on selected options
  const getFilteredData = () => {
    const { numbers, alphabets, highest_lowercase_alphabet } = filteredData;

    if (selectedFilters.length === 0) return 'No filters selected.';

    let result = [];

    if (selectedFilters.includes('numbers') && numbers) {
      result = [...result, ...numbers];
    }
    if (selectedFilters.includes('alphabets') && alphabets) {
      result = [...result, ...alphabets];
    }
    if (selectedFilters.includes('highest_lowercase') && highest_lowercase_alphabet) {
      result = [...result, ...highest_lowercase_alphabet];
    }

    return result.length > 0 ? result.join(', ') : 'No data to display.';
  };

  return (
    <div className="container">
      <div className="input-section">
        <label htmlFor="api-input">API Input</label>
        <input 
          type="text" 
          id="api-input" 
          value={apiInput} 
          onChange={(e) => setApiInput(e.target.value)} 
        />
        <button onClick={handleSubmit} className='w-full'>Submit</button>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="filter-section">
        <label htmlFor="filter">Multi Filter</label>
        <select 
          id="filter" 
          multiple 
          value={selectedFilters} 
          onChange={handleFilterChange}
          style={{ height: '100px', width: '200px' }}
        >
          <option value="numbers">Numbers</option>
          <option value="alphabets">Alphabets</option>
          <option value="highest_lowercase">Highest Lowercase Alphabet</option>
        </select>
      </div>

      <div className="response-section">
        <h3>Filtered Response</h3>
        <p>{getFilteredData()}</p>
      </div>
    </div>
  );
}

export default App;
