import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, Flame } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const fetchMarketData = async () => {
  const [globalData, trendingCoins, topGainers] = await Promise.all([
    fetch('https://api.coingecko.com/api/v3/global').then(res => res.json()),
    fetch('https://api.coingecko.com/api/v3/search/trending').then(res => res.json()),
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=3&page=1&sparkline=false').then(res => res.json())
  ]);
  return { globalData, trendingCoins, topGainers };
};

const formatNumber = (num) => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
};

const CoinCard = ({ coin, isTrending }) => (
  <Link to={`/asset/${coin.id}`} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center mb-2">
      <img src={coin.image || coin.large} alt={coin.name} className="w-8 h-8 mr-2 rounded-full" />
      <div>
        <h3 className="font-bold">{coin.name}</h3>
        <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
      </div>
    </div>
    {!isTrending && (
      <div className="mt-2">
        <p className="font-semibold">${coin.current_price.toFixed(2)}</p>
        <p className={`text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {coin.price_change_percentage_24h >= 0 ? <ArrowUpIcon className="inline w-4 h-4 mr-1" /> : <ArrowDownIcon className="inline w-4 h-4 mr-1" />}
          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </p>
      </div>
    )}
  </Link>
);

const Index = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 60000,
  });

  if (isLoading) return <div className="min-h-screen bg-gray-900 p-4 md:p-8 flex flex-col"><Skeleton className="h-64 w-full" /></div>;
  if (error) return <div className="min-h-screen bg-gray-900 p-4 md:p-8 flex flex-col text-red-500">Error: {error.message}</div>;

  const { globalData, trendingCoins, topGainers } = data;

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 flex flex-col">
      <div className="flex-grow">
        <div className="mb-6 md:mb-8 flex flex-col gap-2">
          <h1 className="text-3xl md:text-5xl text-white text-center p-2 md:p-4">Kripto<span className='text-blue-500'>Market</span></h1>
          <p className='text-center'>Empowering your crypto journey with trust and transparency.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Cryptocurrency Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400">Market Cap</p>
              <p className="text-xl font-bold">${formatNumber(globalData.data.total_market_cap.usd)}</p>
              <p className={`text-sm ${globalData.data.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {globalData.data.market_cap_change_percentage_24h_usd >= 0 ? <ArrowUpIcon className="inline w-4 h-4 mr-1" /> : <ArrowDownIcon className="inline w-4 h-4 mr-1" />}
                {Math.abs(globalData.data.market_cap_change_percentage_24h_usd).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-gray-400">24h Trading Volume</p>
              <p className="text-xl font-bold">${formatNumber(globalData.data.total_volume.usd)}</p>
            </div>
            <div>
              <p className="text-gray-400">Bitcoin Dominance</p>
              <p className="text-xl font-bold">{globalData.data.market_cap_percentage.btc.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center"><Flame className="mr-2 text-orange-500" /> Trending</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trendingCoins.coins.slice(0, 4).map((item) => (
                <CoinCard key={item.item.id} coin={item.item} isTrending={true} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center"><TrendingUpIcon className="mr-2 text-green-500" /> Top Gainers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topGainers.map((coin) => (
                <CoinCard key={coin.id} coin={coin} />
              ))}
            </div>
          </div>
        </div>
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

export default Index;
