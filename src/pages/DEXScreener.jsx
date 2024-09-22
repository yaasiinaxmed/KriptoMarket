import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const chainOptions = [
  { value: 'solana', label: 'Solana' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'tron', label: 'Tron' },
  { value: 'base', label: 'Base' },
  { value: 'bsc', label: 'BNB Chain' },
];

const fetchTokenProfiles = async () => {
  const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1');
  if (!response.ok) {
    throw new Error('Failed to fetch token profiles');
  }
  return response.json();
};

const DEXScreener = () => {
  const [selectedChain, setSelectedChain] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: tokenProfiles, isLoading, error } = useQuery({
    queryKey: ['tokenProfiles'],
    queryFn: fetchTokenProfiles,
    refetchInterval: 60000, // Refetch every minute
  });

  const filteredTokens = tokenProfiles?.filter(token => 
    (!selectedChain || token.chainId === selectedChain) &&
    (!searchTerm || token.description?.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              <img src={token.icon} alt={token.description} className="w-12 h-12 mb-2 rounded-full" />
              <h3 className="text-lg font-semibold mb-2">{token.description}</h3>
              <p className="text-sm text-gray-400 mb-2">Chain: {token.chainId}</p>
              <a href={token.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
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