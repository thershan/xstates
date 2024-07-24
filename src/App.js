import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://crio-location-selector.onrender.com/countries');
      console.log('Countries fetched:', response.data);
      const uniqueCountries = [...new Set(response.data.map(country => country.trim()))];
      setCountries(uniqueCountries);
    } catch (error) {
      setError('Error fetching countries');
      console.error('Error fetching countries:', error);
    }
    setLoading(false);
  };

  const fetchStates = async (countryName) => {
    if (!countryName) {
      console.error('No country selected');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://crio-location-selector.onrender.com/country=${encodeURIComponent(countryName)}/states`);
      console.log(`States fetched for ${countryName}:`, response.data);
      setStates(response.data);
      setCities([]);
      setSelectedCity('');
    } catch (error) {
      setError(`Error fetching states for ${countryName}`);
      console.error(`Error fetching states for ${countryName}:`, error);
      setStates([]);
    }
    setLoading(false);
  };

  const fetchCities = async (countryName, stateName) => {
    if (!countryName || !stateName) {
      console.error('No country or state selected');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://crio-location-selector.onrender.com/country=${encodeURIComponent(countryName)}/state=${encodeURIComponent(stateName)}/cities`);
      console.log(`Cities fetched for ${stateName}, ${countryName}:`, response.data);
      setCities(response.data);
    } catch (error) {
      setError(`Error fetching cities for ${stateName}, ${countryName}`);
      console.error(`Error fetching cities for ${stateName}, ${countryName}:`, error);
      setCities([]);
    }
    setLoading(false);
  };

  const handleCountryChange = (event) => {
    const countryName = event.target.value;
    setSelectedCountry(countryName);
    fetchStates(countryName);
  };

  const handleStateChange = (event) => {
    const stateName = event.target.value;
    setSelectedState(stateName);
    fetchCities(selectedCountry, stateName);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div className="app">
      <h1>Select Location</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="dropdown-container">
        <div className="dropdown">
          <label>Select Country: </label>
          <select value={selectedCountry} onChange={handleCountryChange}>
            <option>Select Country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>
        </div>
        <div className="dropdown">
          <label>Select State: </label>
          <select value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
            <option>Select State</option>
            {states.map((state, index) => (
              <option key={index} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div className="dropdown">
          <label>Select City: </label>
          <select value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
            <option>Select City</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>
      {selectedCountry && selectedState && selectedCity && (
        <h2>You selected {selectedCity}, {selectedState}, {selectedCountry}</h2>
      )}
    </div>
  );
}

export default App;
