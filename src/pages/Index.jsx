import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowUpIcon, ArrowDownIcon, SearchIcon } from 'lucide-react';

const fetchAllAssets = async () => {
  const response = await fetch('https://api.coincap.io/v2/assets?limit=200');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['allAssets'],
    queryFn: fetchAllAssets,
  });

  if (isLoading) return <div className="text-center text-2xl font-bold mt-10">Loading...</div>;
  if (error) return <div className="text-center text-2xl font-bold mt-10 text-red-600">Error: {error.message}</div>;

  const filteredAssets = data.data.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-5xl font-black mb-8 text-center bg-white text-black p-4">Crypto Assets</h1>
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-2 rounded-full bg-gray-800 text-white border-4 border-white focus:outline-none"
          />
          <SearchIcon className="absolute right-4 top-3 text-white" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => (
          <Link to={`/asset/${asset.id}`} key={asset.id} className="block">
            <div className="crypto-card">
              <div className="flex items-center mb-2">
                <img
                  src={`https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`}
                  alt={asset.name}
                  className="w-8 h-8 mr-2"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://assets.coincap.io/assets/icons/btc@2x.png' }}
                />
                <h2 className="text-xl font-bold">{asset.name} ({asset.symbol})</h2>
              </div>
              <p className="text-lg font-semibold mb-2">${parseFloat(asset.priceUsd).toFixed(2)}</p>
              <p className="flex items-center">
                {asset.changePercent24Hr > 0 ? (
                  <ArrowUpIcon className="text-green-500 mr-1" />
                ) : (
                  <ArrowDownIcon className="text-red-500 mr-1" />
                )}
                <span className={asset.changePercent24Hr > 0 ? 'text-green-500' : 'text-red-500'}>
                  {parseFloat(asset.changePercent24Hr).toFixed(2)}%
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Index;
