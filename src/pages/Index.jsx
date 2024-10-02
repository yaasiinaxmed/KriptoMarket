import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownIcon, ArrowUpIcon, Flame, SearchIcon, TrendingUpIcon } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import CategoryFilter from '../components/CategoryFilter';
import CoinListItem from '../components/CoinListItem';
import { toast } from "sonner";
import { Link } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { translate, getStoredLanguage, setStoredLanguage } from '../utils/translate';

const fetchAllAssets = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const formatNumber = (num) => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
};

const getCategoryForAsset = (asset) => {
  const name = asset.name.toLowerCase();
  const symbol = asset.symbol.toLowerCase();

  if (name.includes('doge') || name.includes('shib') || symbol.includes('pepe') || symbol.includes('wif') || symbol.includes('floki') || symbol.includes('bonk') || symbol.includes('brett')) {
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
  const [language, setLanguage] = useState(getStoredLanguage());
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['allAssets'],
    queryFn: fetchAllAssets,
    refetchInterval: 120000, // Refetch every 2 minutes
    retry: 3,
    onError: (error) => {
      toast.error(`Failed to fetch data: ${error.message}. Please try again later.`);
    },
  });

  useEffect(() => {
    setStoredLanguage(language);
  }, [language]);

  const filteredAssets = data
    ? data.filter(asset =>
      (asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeCategory === 'all' || getCategoryForAsset(asset) === activeCategory)
    )
    : [];

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 flex flex-col">
      <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
      <div className="flex-grow">
        <div className="mb-6 md:mb-8 flex flex-col items-center justify-center gap-4">
          <img src="./logo.png" alt="Kriptomarket Logo" className="w-[15rem] sm:w-[20rem]" />
          <p className='text-center'>{translate('empowering', language)}</p>
        </div>
        <div className="mb-4 md:mb-6 flex justify-center">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder={translate('search', language)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-gray-800 text-white border-2 md:border-2 border-white focus:outline-none"
            />
            <SearchIcon className="absolute right-4 top-3 text-white" />
          </div>
        </div>
        <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-4 items-center py-2 md:py-4 px-2 md:px-4 bg-gray-800 font-bold text-xs md:text-sm">
              <div className="col-span-2">{translate('name', language)}</div>
              <div className="text-right">{translate('price', language)}</div>
              <div className="text-right">{translate('change24h', language)}</div>
              <div className="text-right hidden md:block">{translate('marketCap', language)}</div>
              <div className="text-right hidden md:block">{translate('volume', language)}</div>
              <div className="text-right hidden lg:block">{translate('circulatingSupply', language)}</div>
            </div>
            {isLoading ? (
              Array(20).fill().map((_, index) => <SkeletonRow key={index} />)
            ) : error ? (
              <div className="col-span-full text-center text-xl md:text-2xl font-bold mt-10 text-red-600">
                Error: Unable to fetch data. <button onClick={() => refetch()} className="text-blue-500 underline">{translate('tryAgain', language)}</button>
              </div>
            ) : (
              filteredAssets.map((asset) => <CoinListItem key={asset.id} asset={asset} />)
            )}
          </div>
        </div>
      </div>
      <footer className="mt-8 bg-gray-800 rounded-lg py-6 text-white">
        <div className="container mx-auto text-center">
          <p className="text-sm mb-4">{translate('footer', language)}</p>
          <p className="mb-4">{translate('empowering', language)}</p>
          <p>
            {translate('builtBy', language)}
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

export default Index;
