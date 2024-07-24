import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get('https://crio-location-selector.onrender.com/countries');
      console.log('Countries fetched:', response.data); // Debugging line
      // Trim whitespace from country names
      const sanitizedCountries = response.data.map(country => country.trim());
      setCountries(sanitizedCountries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStates = async (countryName) => {
    if (!countryName) {
      console.error('No country selected');
      return;
    }

    try {
      const response = await axios.get(`https://crio-location-selector.onrender.com/country=${encodeURIComponent(countryName)}/states`);
      console.log(`States fetched for ${countryName}:`, response.data); // Debugging line
      setStates(response.data);
      setCities([]);
      setSelectedCity('');
    } catch (error) {
      console.error(`Error fetching states for ${countryName}:`, error);
      setStates([]);
    }
  };

  const fetchCities = async (countryName, stateName) => {
    if (!countryName || !stateName) {
      console.error('No country or state selected');
      return;
    }

    try {
      const response = await axios.get(`https://crio-location-selector.onrender.com/country=${encodeURIComponent(countryName)}/state=${encodeURIComponent(stateName)}/cities`);
      console.log(`Cities fetched for ${stateName}, ${countryName}:`, response.data); // Debugging line
      setCities(response.data);
    } catch (error) {
      console.error(`Error fetching cities for ${stateName}, ${countryName}:`, error);
      setCities([]);
    }
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
    <div>
      <h1>Select Location</h1>
      <div>
        <label>Select Country: </label>
        <select value={selectedCountry} onChange={handleCountryChange}>
          <option>Select Country</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>{country}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Select State: </label>
        <select value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
          <option>Select State</option>
          {states.map((state, index) => (
            <option key={index} value={state}>{state}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Select City: </label>
        <select value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
          <option>Select City</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>{city}</option>
          ))}
        </select>
      </div>
      {selectedCountry && selectedState && selectedCity && (
        <h2>You selected {selectedCity}, {selectedState}, {selectedCountry}</h2>
      )}
    </div>
  );
}

export default App;
