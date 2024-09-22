import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const chainOptions = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'bsc', label: 'BNB Chain' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'avalanche', label: 'Avalanche' },
  { value: 'fantom', label: 'Fantom' },
];

const fetchPairs = async () => {
  const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/0x2170Ed0880ac9A755fd29B2688956BD959F933F8,0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c');
  if (!response.ok) {
    throw new Error('Failed to fetch pairs');
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

  const { data, isLoading, error } = useQuery({
    queryKey: ['dexPairs'],
    queryFn: fetchPairs,
    refetchInterval: 60000, // Refetch every minute
  });

  const filteredPairs = data?.pairs?.filter(pair => 
    (!selectedChain || pair.chainId === selectedChain) &&
    (!searchTerm || 
      pair.baseToken.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pair.quoteToken.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">DEX Screener</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select onValueChange={setSelectedChain} value={selectedChain}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select Chain" />
          </SelectTrigger>
          <SelectContent>
            {chainOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-[300px]"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full bg-gray-800" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500">Error: {error.message}</div>
      ) : (
        <div className="space-y-4">
          {filteredPairs.map((pair, index) => (
            <div key={pair.pairAddress} className="bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center mb-2 md:mb-0">
                <span className="text-lg font-semibold mr-4">#{index + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold">{pair.baseToken.symbol}/{pair.quoteToken.symbol}</h3>
                  <p className="text-sm text-gray-400">Chain: {pair.chainId}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-lg font-semibold">${parseFloat(pair.priceUsd).toFixed(6)}</p>
                <p className={`text-sm ${pair.priceChange.h24 >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {pair.priceChange.h24 >= 0 ? <ArrowUpIcon className="inline w-4 h-4 mr-1" /> : <ArrowDownIcon className="inline w-4 h-4 mr-1" />}
                  {Math.abs(pair.priceChange.h24).toFixed(2)}%
                </p>
              </div>
              <div className="flex flex-col items-end mt-2 md:mt-0">
                <p className="text-sm">Volume 24h: ${formatNumber(pair.volume.h24)}</p>
                <p className="text-sm">Liquidity: ${formatNumber(pair.liquidity.usd)}</p>
              </div>
              <a 
                href={`https://dexscreener.com/${pair.chainId}/${pair.pairAddress}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-2 md:mt-0 text-blue-400 hover:text-blue-300"
              >
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
