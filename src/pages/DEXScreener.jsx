import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon } from 'lucide-react';

const chainOptions = [
  { value: 'all', label: 'All Chains' },
  { value: 'solana', label: 'Solana' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'tron', label: 'Tron' },
  { value: 'base', label: 'Base' },
  { value: 'bsc', label: 'BNB Chain' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'defi', label: 'DeFi' },
  { value: 'meme', label: 'Meme' },
  { value: 'nft', label: 'NFT' },
  { value: 'gaming', label: 'Gaming' },
];

const fetchDEXScreenerTokens = async () => {
  const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1');
  if (!response.ok) {
    throw new Error('Failed to fetch DEXScreener tokens');
  }
  return response.json();
};

const DEXScreener = () => {
  const [selectedChain, setSelectedChain] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: tokens, isLoading, error } = useQuery({
    queryKey: ['dexScreenerTokens'],
    queryFn: fetchDEXScreenerTokens,
    refetchInterval: 60000, // Refetch every minute
  });

  const filteredTokens = tokens?.filter(token => 
    (selectedChain === 'all' || token.chainId === selectedChain) &&
    (selectedCategory === 'all' || token.category === selectedCategory) &&
    (!searchTerm || token.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <Link to="/" className="inline-flex items-center text-white mb-6 hover:underline">
        <ArrowLeftIcon className="mr-2" /> Back to Home
      </Link>
      
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
        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map(option => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-40 w-full bg-gray-800" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500">Error: {error.message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTokens.map((token, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center mb-2">
                <img src={token.icon} alt={token.description} className="w-10 h-10 mr-3 rounded-full" />
                <div>
                  <h3 className="text-lg font-semibold">{token.description}</h3>
                  <p className="text-sm text-gray-400">Chain: {token.chainId}</p>
                </div>
              </div>
              <div className="mt-2">
                {token.links && token.links.map((link, linkIndex) => (
                  <a 
                    key={linkIndex} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block bg-gray-700 text-blue-400 px-2 py-1 rounded mr-2 mb-2 text-sm hover:bg-gray-600"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <a 
                href={token.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-2 inline-block text-blue-400 hover:text-blue-300"
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
