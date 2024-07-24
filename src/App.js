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
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStates = async (countryName) => {
    try {
      const response = await axios.get(`https://crio-location-selector.onrender.com/country=${countryName}/states`);
      setStates(response.data);
      setCities([]);
      setSelectedCity('');
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async (countryName, stateName) => {
    try {
      const response = await axios.get(`https://crio-location-selector.onrender.com/country=${countryName}/state=${stateName}/cities`);
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
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
          {countries.map((country) => (
            <option key={country.name} value={country.name}>{country.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Select State: </label>
        <select value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
          <option>Select State</option>
          {states.map((state) => (
            <option key={state.name} value={state.name}>{state.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Select City: </label>
        <select value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
          <option>Select City</option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>{city.name}</option>
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
