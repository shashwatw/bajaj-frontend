"use client";
import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
  FormHelperText,
  Button,
  Typography,
} from "@mui/material";

function App() {
  const [apiInput, setApiInput] = useState(
    '{"data":["M","1","334","4","B","a","z"]}'
  );
  const [filteredData, setFilteredData] = useState({});
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      // Validate JSON input
      const parsedData = JSON.parse(apiInput);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error("Invalid JSON format.");
      }

      // Make the API request
      const response = await fetch(
        "https://bajaj-backend-n8wj.onrender.com/bfhl",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedData),
        }
      );

      if (!response.ok) {
        throw new Error("Error in API request.");
      }

      const data = await response.json();
      // Handle API response
      setFilteredData(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (event) => {
    setSelectedFilters(event.target.value);
  };

  // Function to filter the data based on selected options
  const getFilteredData = () => {
    const { numbers, alphabets, highest_lowercase_alphabet } = filteredData;

    if (selectedFilters.length === 0) return "No filters selected.";

    let result = {
      numbers: [],
      alphabets: [],
      highest_lowercase: [],
    };

    if (selectedFilters.includes("numbers") && numbers) {
      result.numbers = numbers;
    }
    if (selectedFilters.includes("alphabets") && alphabets) {
      result.alphabets = alphabets;
    }
    if (
      selectedFilters.includes("highest_lowercase") &&
      highest_lowercase_alphabet
    ) {
      result.highest_lowercase = highest_lowercase_alphabet;
    }

    return result;
  };

  const renderFilteredData = () => {
    const data = getFilteredData();

    return (
      <div>
        {data?.numbers?.length > 0 && (
          <div>
            <Typography variant="h6">Numbers</Typography>
            <Typography>{data.numbers.join(", ")}</Typography>
          </div>
        )}
        {data?.alphabets?.length > 0 && (
          <div>
            <Typography variant="h6">Alphabets</Typography>
            <Typography>{data.alphabets.join(", ")}</Typography>
          </div>
        )}
        {data?.highest_lowercase?.length > 0 && (
          <div>
            <Typography variant="h6">Highest Lowercase Alphabet</Typography>
            <Typography>{data.highest_lowercase.join(", ")}</Typography>
          </div>
        )}
        {data?.numbers?.length === 0 &&
          data?.alphabets?.length === 0 &&
          data?.highest_lowercase?.length === 0 && (
            <Typography>No data to display.</Typography>
          )}
      </div>
    );
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <div className="input-section" style={{ marginBottom: "20px" }}>
        <Typography variant="h6">API Input</Typography>
        <input
          type="text"
          value={apiInput}
          onChange={(e) => setApiInput(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Submit
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </div>

      <div className="filter-section" style={{ marginBottom: "20px" }}>
        <FormControl fullWidth>
          <InputLabel>Multi Filter</InputLabel>
          <Select
            multiple
            value={selectedFilters}
            onChange={handleFilterChange}
            input={<OutlinedInput label="Multi Filter" />}
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} style={{ margin: 2 }} />
                ))}
              </div>
            )}
          >
            <MenuItem value="numbers">Numbers</MenuItem>
            <MenuItem value="alphabets">Alphabets</MenuItem>
            <MenuItem value="highest_lowercase">
              Highest Lowercase Alphabet
            </MenuItem>
          </Select>
          <FormHelperText>Select filters</FormHelperText>
        </FormControl>
      </div>

      <div className="response-section">
        <Typography variant="h6">Filtered Response</Typography>
        {renderFilteredData()}
      </div>
    </div>
  );
}

export default App;
