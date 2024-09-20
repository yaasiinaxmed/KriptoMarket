import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowUpIcon, ArrowDownIcon, SearchIcon } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const fetchAllAssets = async () => {
  const response = await fetch('https://api.coincap.io/v2/assets?limit=2000');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const AssetCard = ({ asset, rank }) => (
  <Link to={`/asset/${asset.id}`} className="block">
    <div className="crypto-card relative">
      <div className="absolute top-0 left-0 bg-white text-black font-bold px-2 py-1 text-sm">
        #{rank}
      </div>
      <div className="flex items-center mb-2 mt-6">
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
);

const SkeletonCard = () => (
  <div className="crypto-card relative">
    <Skeleton className="absolute top-0 left-0 w-8 h-6" />
    <div className="flex items-center mb-2 mt-6">
      <Skeleton className="w-8 h-8 mr-2 rounded-full" />
      <Skeleton className="h-6 w-3/4" />
    </div>
    <Skeleton className="h-6 w-1/2 mb-2" />
    <Skeleton className="h-4 w-1/4" />
  </div>
);

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['allAssets'],
    queryFn: fetchAllAssets,
  });

  const filteredAssets = isLoading ? [] : data.data.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-5xl font-black mb-8 text-center bg-white text-black p-4">2000 Crypto Assets</h1>
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
        {isLoading ? (
          Array(20).fill().map((_, index) => <SkeletonCard key={index} />)
        ) : error ? (
          <div className="col-span-full text-center text-2xl font-bold mt-10 text-red-600">Error: {error.message}</div>
        ) : (
          filteredAssets.map((asset, index) => <AssetCard key={asset.id} asset={asset} rank={index + 1} />)
        )}
      </div>
      {!isLoading && !error && (
        <p className="text-center mt-8 text-xl">
          Displaying {filteredAssets.length} out of {data.data.length} cryptocurrencies
        </p>
      )}
    </div>
  );
};

export default Index;
