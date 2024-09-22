import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, SearchIcon, ExternalLinkIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const fetchLatestPairs = async () => {
  const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/bsc/0x10ED43C718714eb63d5aA57B78B54704E256024E');
  if (!response.ok) {
    throw new Error('Failed to fetch latest pairs');
  }
  return response.json();
};

const DEXScreener = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['latestPairs'],
    queryFn: fetchLatestPairs,
    refetchInterval: 60000,
    retry: 3,
    onError: (error) => {
      toast.error(`Failed to fetch data: ${error.message}. Please try again later.`);
    },
  });

  const filteredPairs = data?.pairs?.filter(pair =>
    pair.baseToken.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pair.quoteToken.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 flex flex-col">
      <div className="flex-grow">
        <Link to="/" className="inline-flex items-center text-white mb-6 hover:underline">
          <ArrowLeftIcon className="mr-2" /> Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">DEX Screener</h1>
        
        <div className="mb-6 flex justify-center">
          <div className="relative w-full md:w-96">
            <Input
              type="text"
              placeholder="Search by token symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-gray-800 text-white border-2 border-white focus:outline-none"
            />
            <SearchIcon className="absolute right-4 top-3 text-white" />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-40 w-full bg-gray-800" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">Error: {error.message}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPairs.map((pair, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{pair.baseToken.symbol}/{pair.quoteToken.symbol}</h3>
                <p className="text-sm text-gray-400 mb-2">Price: ${parseFloat(pair.priceUsd).toFixed(6)}</p>
                <p className="text-sm text-gray-400 mb-2">24h Volume: ${parseInt(pair.volume.h24).toLocaleString()}</p>
                <p className="text-sm text-gray-400 mb-2">Liquidity: ${parseInt(pair.liquidity.usd).toLocaleString()}</p>
                <a 
                  href={`https://dexscreener.com/${pair.chainId}/${pair.pairAddress}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-400 hover:text-blue-300 flex items-center"
                >
                  View on DEXScreener
                  <ExternalLinkIcon className="ml-1 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
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
