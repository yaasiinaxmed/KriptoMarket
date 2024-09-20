import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import CategoryFilter from '../components/CategoryFilter';
import CoinListItem from '../components/CoinListItem';
import { fetchDexScreenerData, getCategoryForAsset } from '../utils/dexScreenerApi';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { data, isLoading, error } = useQuery({
    queryKey: ['dexScreenerAssets'],
    queryFn: fetchDexScreenerData,
    refetchInterval: 60000,
  });

  const filteredAssets = data
    ? data.filter(asset =>
        (asset.baseToken.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         asset.baseToken.symbol.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (activeCategory === 'all' || getCategoryForAsset(asset) === activeCategory)
      )
    : [];

  const SkeletonRow = () => (
    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-4 items-center py-2 md:py-4 px-2 md:px-4 border-b border-gray-700">
      {[...Array(7)].map((_, index) => (
        <Skeleton key={index} className={`h-6 w-full bg-gray-800 ${index > 3 && index < 6 ? 'hidden md:block' : ''} ${index === 6 ? 'hidden lg:block' : ''}`} />
      ))}
    </div>
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
            <div className="text-right hidden md:block">Liquidity</div>
            <div className="text-right hidden md:block">Volume(24h)</div>
            <div className="text-right hidden lg:block">Chain</div>
          </div>
          {isLoading ? (
            Array(20).fill().map((_, index) => <SkeletonRow key={index} />)
          ) : error ? (
            <div className="col-span-full text-center text-xl md:text-2xl font-bold mt-10 text-red-600">Error: Unable to fetch data</div>
          ) : (
            filteredAssets.map((asset) => <CoinListItem key={asset.pairAddress} asset={asset} />)
          )}
        </div>
      </div>
      {!isLoading && !error && (
        <p className="text-center mt-6 md:mt-8 text-lg md:text-xl">
          Displaying {filteredAssets.length} out of {data ? data.length : 0} cryptocurrencies
        </p>
      )}
    </div>
  );
};

export default Index;
