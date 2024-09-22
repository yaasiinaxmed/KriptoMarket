import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon, SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const chainOptions = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'binance-smart-chain', label: 'BNB Chain' },
  { value: 'polygon-pos', label: 'Polygon' },
  { value: 'avalanche', label: 'Avalanche' },
  { value: 'fantom', label: 'Fantom' },
];

const fetchCoins = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false');
  if (!response.ok) {
    throw new Error('Failed to fetch coins');
  }
  return response.json();
};

const formatNumber = (num) => {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
};

const DEXScreener = () => {
  const [selectedChain, setSelectedChain] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: coins, isLoading, error } = useQuery({
    queryKey: ['coins'],
    queryFn: fetchCoins,
    refetchInterval: 60000, // Refetch every minute
  });

  const filteredCoins = coins?.filter(coin => 
    (!selectedChain || coin.asset_platform_id === selectedChain) &&
    (!searchTerm || 
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 flex flex-col">
      <div className="flex-grow">
        <div className="mb-6 md:mb-8 flex flex-col gap-2">
          <h1 className="text-3xl md:text-5xl text-white text-center p-2 md:p-4">DEX<span className='text-blue-500'>Screener</span></h1>
          <p className='text-center'>Real-time cryptocurrency information and analytics</p>
        </div>
        <div className="mb-4 md:mb-6 flex flex-col md:flex-row justify-center gap-4">
          <div className="relative w-full md:w-96">
            <Input
              type="text"
              placeholder="Search coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-gray-800 text-white border-2 md:border-2 border-white focus:outline-none"
            />
            <SearchIcon className="absolute right-4 top-3 text-white" />
          </div>
          <Select onValueChange={setSelectedChain} value={selectedChain}>
            <SelectTrigger className="w-full md:w-[200px] bg-gray-800 text-white border-2 border-white">
              <SelectValue placeholder="Select Chain" />
            </SelectTrigger>
            <SelectContent>
              {chainOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-7 gap-2 md:gap-4 items-center py-2 md:py-4 px-2 md:px-4 bg-gray-800 font-bold text-xs md:text-sm">
              <div className="col-span-2">Name</div>
              <div className="text-right">Price</div>
              <div className="text-right">24h %</div>
              <div className="text-right">Volume(24h)</div>
              <div className="text-right">Market Cap</div>
              <div className="text-right">Actions</div>
            </div>
            {isLoading ? (
              Array(10).fill().map((_, index) => (
                <div key={index} className="grid grid-cols-7 gap-2 md:gap-4 items-center py-2 md:py-4 px-2 md:px-4 border-b border-gray-700">
                  {[...Array(7)].map((_, colIndex) => (
                    <Skeleton key={colIndex} className={`h-6 w-full bg-gray-800`} />
                  ))}
                </div>
              ))
            ) : error ? (
              <div className="col-span-7 text-center text-xl md:text-2xl font-bold mt-10 text-red-600">
                Error: {error.message}
              </div>
            ) : (
              filteredCoins.map((coin, index) => (
                <div key={coin.id} className="grid grid-cols-7 gap-2 md:gap-4 items-center py-2 md:py-4 px-2 md:px-4 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                  <div className="col-span-2 flex items-center">
                    <span className="font-bold mr-2 w-6 md:w-8 text-right">{index + 1}</span>
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-5 h-5 md:w-6 md:h-6 mr-2"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.svg'; }}
                    />
                    <div>
                      <span className="font-bold">{coin.name}</span>
                      <span className="text-gray-400 ml-1 hidden sm:inline">({coin.symbol.toUpperCase()})</span>
                    </div>
                  </div>
                  <div className="text-right">${coin.current_price.toFixed(2)}</div>
                  <div className={`text-right ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {coin.price_change_percentage_24h >= 0 ? <ArrowUpIcon className="inline w-4 h-4 mr-1" /> : <ArrowDownIcon className="inline w-4 h-4 mr-1" />}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </div>
                  <div className="text-right">${formatNumber(coin.total_volume)}</div>
                  <div className="text-right">${formatNumber(coin.market_cap)}</div>
                  <div className="text-right">
                    <Link
                      to={`/asset/${coin.id}`}
                      className="text-blue-400 hover:text-blue-300 mr-2"
                    >
                      Details
                    </Link>
                    <a 
                      href={`https://www.coingecko.com/en/coins/${coin.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-300"
                    >
                      CoinGecko
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {!isLoading && !error && (
          <p className="text-center mt-6 md:mt-8 text-lg md:text-xl">
            Displaying {filteredCoins.length} out of {coins?.length || 0} coins
          </p>
        )}
      </div>
      <footer className="mt-8 bg-gray-800 rounded-lg py-6 text-white">
        <div className="container mx-auto text-center">
          <p className="text-sm mb-4">© 2024 KriptoMarket. All rights reserved.</p>
          <p className="mb-4">Empowering your crypto journey with trust and transparency.</p>
          <p>
            Built with 💙 by
            <a
              href="https://github.com/yaasiinaxmed"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer ml-1 text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              Yasin Ahmed
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DEXScreener;
