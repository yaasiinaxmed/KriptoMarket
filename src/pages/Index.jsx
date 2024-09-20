import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import CategoryFilter from '../components/CategoryFilter';
import CoinListItem from '../components/CoinListItem';

const fetchAllAssets = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();

  // Add custom coins
  const customCoins = [
    {
      id: 'pumpfun',
      symbol: 'pumpfun',
      name: 'Pump Fun',
      image: 'https://example.com/pumpfun.png',
      current_price: 0.1,
      market_cap: 1000000,
      market_cap_rank: null,
      fully_diluted_valuation: 1000000,
      total_volume: 100000,
      high_24h: 0.11,
      low_24h: 0.09,
      price_change_24h: 0.01,
      price_change_percentage_24h: 10,
      market_cap_change_24h: 100000,
      market_cap_change_percentage_24h: 10,
      circulating_supply: 10000000,
      total_supply: 100000000,
      max_supply: 100000000,
      ath: 0.15,
      ath_change_percentage: -33.33,
      ath_date: "2023-01-01T00:00:00.000Z",
      atl: 0.05,
      atl_change_percentage: 100,
      atl_date: "2022-01-01T00:00:00.000Z",
      roi: null,
      last_updated: "2023-04-30T00:00:00.000Z"
    },
    {
      id: 'sunpump',
      symbol: 'sunpump',
      name: 'Sun Pump',
      image: 'https://example.com/sunpump.png',
      current_price: 0.2,
      market_cap: 2000000,
      market_cap_rank: null,
      fully_diluted_valuation: 2000000,
      total_volume: 200000,
      high_24h: 0.22,
      low_24h: 0.18,
      price_change_24h: 0.02,
      price_change_percentage_24h: 11,
      market_cap_change_24h: 200000,
      market_cap_change_percentage_24h: 11,
      circulating_supply: 10000000,
      total_supply: 100000000,
      max_supply: 100000000,
      ath: 0.25,
      ath_change_percentage: -20,
      ath_date: "2023-02-01T00:00:00.000Z",
      atl: 0.1,
      atl_change_percentage: 100,
      atl_date: "2022-02-01T00:00:00.000Z",
      roi: null,
      last_updated: "2023-04-30T00:00:00.000Z"
    }
  ];

  return [...data, ...customCoins];
};

const getCategoryForAsset = (asset) => {
  const name = asset.name.toLowerCase();
  const symbol = asset.symbol.toLowerCase();

  if (name.includes('doge') || name.includes('shib') || symbol.includes('pepe') || symbol.includes('wif') || symbol.includes('floki') || symbol.includes('bonk') || symbol.includes('brett') || name === 'pump fun' || name === 'sun pump') {
    return 'meme';
  } else if (name.includes('ai') || name.includes('artificial intelligence')) {
    return 'ai';
  } else if (['btc', 'eth', 'sol', 'ada', 'dot'].includes(symbol)) {
    return 'layer1';
  } else if (['matic', 'arb', 'op'].includes(symbol)) {
    return 'layer2';
  }
  return 'all';
};

const SkeletonRow = () => (
  <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-4 items-center py-2 md:py-4 px-2 md:px-4 border-b border-gray-700">
    {[...Array(7)].map((_, index) => (
      <Skeleton key={index} className={`h-6 w-full bg-gray-800 ${index > 3 && index < 6 ? 'hidden md:block' : ''} ${index === 6 ? 'hidden lg:block' : ''}`} />
    ))}
  </div>
);

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { data, isLoading, error } = useQuery({
    queryKey: ['allAssets'],
    queryFn: fetchAllAssets,
    refetchInterval: 60000,
  });

  const filteredAssets = isLoading ? [] : data
    .filter(asset =>
      (asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeCategory === 'all' || getCategoryForAsset(asset) === activeCategory)
    );

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <h1 className="text-3xl md:text-5xl text-white mb-6 md:mb-8 text-center p-2 md:p-4">KriptoMarket</h1>
      <div className="mb-4 md:mb-6 flex justify-center">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-gray-800 text-white border-2 md:border-4 border-white focus:outline-none"
          />
          <SearchIcon className="absolute right-4 top-3 text-white" />
        </div>
      </div>
      <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-4 items-center py-2 md:py-4 px-2 md:px-4 bg-gray-800 font-bold text-xs md:text-sm">
            <div className="col-span-2">Name</div>
            <div className="text-right">Price</div>
            <div className="text-right">24h %</div>
            <div className="text-right hidden md:block">Market Cap</div>
            <div className="text-right hidden md:block">Volume(24h)</div>
            <div className="text-right hidden lg:block">Circulating Supply</div>
          </div>
          {isLoading ? (
            Array(20).fill().map((_, index) => <SkeletonRow key={index} />)
          ) : error ? (
            <div className="col-span-full text-center text-xl md:text-2xl font-bold mt-10 text-red-600">Error: {error.message}</div>
          ) : (
            filteredAssets.map((asset) => <CoinListItem key={asset.id} asset={asset} />)
          )}
        </div>
      </div>
      {!isLoading && !error && (
        <p className="text-center mt-6 md:mt-8 text-lg md:text-xl">
          Displaying {filteredAssets.length} out of {data.length} cryptocurrencies
        </p>
      )}
    </div>
  );
};

export default Index;
