import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const fetchDEXScreenerPairs = async () => {
  const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/ethereum/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640');
  if (!response.ok) {
    throw new Error('Failed to fetch DEXScreener pairs');
  }
  return response.json();
};

const DEXScreener = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['dexScreenerPairs'],
    queryFn: fetchDEXScreenerPairs,
    refetchInterval: 60000, // Refetch every minute
  });

  const filteredPairs = data?.pairs?.filter(pair => 
    pair.baseToken.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pair.quoteToken.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <Link to="/" className="inline-flex items-center text-white mb-6 hover:underline">
        <ArrowLeftIcon className="mr-2" /> Back to Home
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">DEX Screener</h1>
      
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-[300px]"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-40 w-full bg-gray-800" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500">Error: {error.message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPairs.map((pair, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-200">
              <h3 className="text-lg font-semibold mb-2">{pair.baseToken.symbol}/{pair.quoteToken.symbol}</h3>
              <p className="text-sm text-gray-400 mb-2">Chain: {pair.chainId}</p>
              <p className="text-sm mb-1">Price: ${parseFloat(pair.priceUsd).toFixed(6)}</p>
              <p className="text-sm mb-1">24h Volume: ${parseInt(pair.volume.h24).toLocaleString()}</p>
              <p className="text-sm mb-2">Liquidity: ${parseInt(pair.liquidity.usd).toLocaleString()}</p>
              <a href={pair.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                View on DEXScreener
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DEXScreener;
