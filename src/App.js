import React, { useState, useEffect } from "react";
import "./App.css";

const apiKey = process.env.REACT_APP_API_KEY;

// Mapping of currency codes to country names
const currencyCountryMap = {
  USD: "United States Dollar",
  EUR: "Euro",
  INR: "Indian Rupee",
  JPY: "Japanese Yen",
  GBP: "British Pound Sterling",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  AED: "United Arab Emirates Dirham",
  CHF: "Swiss Franc",
  // Add more currencies as needed
};

const ForexApp = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [selectedCurrency, setSelectedCurrency] = useState("INR"); // Default comparison currency
  const [forexData, setForexData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiUrl = `https://api.forexrateapi.com/v1/latest?api_key=${apiKey}&base=${baseCurrency}&currencies=USD,EUR,INR,JPY,GBP,AUD,CAD,AED,CHF`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setForexData(data.rates);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [baseCurrency]);

  const handleBaseCurrencyChange = (event) => {
    setBaseCurrency(event.target.value);
  };

  const handleSelectedCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const handleRefresh = async () => {
    try {
      await fetchData();
    } catch (error) {
      console.error("Error refreshing data:", error.message);
    }
  };

  return (
    <div className="forex-container">
      <h1 className="forex-heading">FOREX RATES</h1>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <div className="currency-selection">
            <label htmlFor="baseCurrency">Select Base Currency:</label>
            <select
              id="baseCurrency"
              value={baseCurrency}
              onChange={handleBaseCurrencyChange}
            >
              {Object.keys(forexData).map((currency) => (
                <option key={currency} value={currency}>
                  {/* {`${currency} - ${currencyCountryMap[currency]}`} */}
                  {`${currencyCountryMap[currency]}`}
                </option>
              ))}
            </select>

            <label htmlFor="selectedCurrency">
              Select Comparison Currency:
            </label>
            <select
              id="selectedCurrency"
              value={selectedCurrency}
              onChange={handleSelectedCurrencyChange}
            >
              {Object.keys(forexData).map((currency) => (
                <option key={currency} value={currency}>
                  {/* {`${currency} - ${currencyCountryMap[currency]}`} */}
                  {`${currencyCountryMap[currency]}`}
                </option>
              ))}
            </select>
          </div>

          <div className="usd-box">
            <h2>
              1.0 {baseCurrency} = {forexData[selectedCurrency].toFixed(2)}{" "}
              {selectedCurrency}
            </h2>
          </div>
        </>
      )}

      <button className="refresh-button" onClick={handleRefresh}>
        Refresh
      </button>
    </div>
  );
};

export default ForexApp;
