import React, { useState } from 'react';
import axios from 'axios';

import './App.css';

const App: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [delta, setDelta] = useState(0);
  const [stockPrice, setStockPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicker(e.target.value.toUpperCase());
  };

  const handleDeltaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDelta(parseFloat(e.target.value));
  };

  const fetchStockPrice = async (ticker: string) => {
    setLoading(true);
    setError(null);
    const url = `https://api.tdameritrade.com/v1/marketdata/${ticker}/quotes`;

    try {
      const response = await axios.get(url, {
        params: {
          apikey: process.env.REACT_APP_API_KEY,
        },
      });

      // Assuming the API response has a structure where the price is under a ticker symbol
      const quote = response.data[ticker];
      if (quote) {
        const price = quote.closePrice; // Replace with actual path to price in response if different
        setStockPrice(price);
      } else {
        setError('No quote found for the given ticker');
      }
    } catch (e) {
      setError('Failed to fetch stock price');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <div className="mb-4">
          <label htmlFor="ticker" className="block text-sm font-medium mb-2">Ticker:</label>
          <input
            id="ticker"
            type="text"
            value={ticker}
            onChange={handleTickerChange}
            className="w-full p-2 rounded text-black"
            placeholder="Enter Ticker"
          />
          <button
            onClick={() => fetchStockPrice(ticker)}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Stock Price'}
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="delta" className="block text-sm font-medium mb-2">
            Delta: {delta.toFixed(2)}
          </label>
          <input
            id="delta"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={delta}
            onChange={handleDeltaChange}
            className="w-full"
          />
        </div>
      </aside>
      <main className="flex-1 bg-gray-100 p-4">
        <h1>Welcome to the App!</h1>
        <p> Ticker: {ticker}</p>
        <p> Delta: {delta}</p>
        {error && <p className="text-red-600">{error}</p>}
        {stockPrice !== null && <p>Stock Price: ${stockPrice.toFixed(2)}</p>}
      </main>
    </div>
  );
};

export default App;
