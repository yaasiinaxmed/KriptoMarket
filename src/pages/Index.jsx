import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownIcon, ArrowUpIcon, Flame, SearchIcon, TrendingUpIcon } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import CategoryFilter from '../components/CategoryFilter';
import CoinListItem from '../components/CoinListItem';
import { toast } from "sonner";
import { Link } from 'react-router-dom';

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

// const fetchMarketData = async () => {
//   const [globalData, trendingCoins, topGainers] = await Promise.all([
//     fetch('https://api.coingecko.com/api/v3/global').then(res => res.json()),
//     fetch('https://api.coingecko.com/api/v3/search/trending').then(res => res.json()),
//     fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=3&page=1&sparkline=false').then(res => res.json())
//   ]);
//   return { globalData, trendingCoins, topGainers };
// };

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


// const CoinCard = ({ coin, isTrending }) => (
//   <Link to={`/asset/${coin.id}`} className="bg-gray-800 p-4 rounded-lg shadow-md transition-transform duration-200 transform hover:scale-105">
//     <div className="flex items-center mb-2">
//       <img src={coin.image || coin.large} alt={coin.name} className="w-10 h-10 mr-3 rounded-full border-2 border-gray-700" />
//       <div>
//         <h3 className="font-bold text-lg text-white">{coin.name}</h3>
//         <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
//       </div>
//     </div>
//     {!isTrending && (
//       <div className="mt-2">
//         <p className="font-semibold text-xl text-white">${coin.current_price.toFixed(2)}</p>
//         <p className={`text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//           {coin.price_change_percentage_24h >= 0 ? (
//             <ArrowUpIcon className="inline w-4 h-4 mr-1" />
//           ) : (
//             <ArrowDownIcon className="inline w-4 h-4 mr-1" />
//           )}
//           {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
//         </p>
//       </div>
//     )}
//   </Link>
// );

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['allAssets'],
    queryFn: fetchAllAssets,
    refetchInterval: 120000,
    retry: 3,
    onError: (error) => {
      toast.error(`Failed to fetch data: ${error.message}. Please try again later.`);
    },
  });

  // const { data: dataMarket, isLoading: marketIsLoading, error: marketError } = useQuery({
  //   queryKey: ['marketData'],
  //   queryFn: fetchMarketData,
  //   refetchInterval: 60000,
  // });

  // const { globalData, trendingCoins, topGainers } = dataMarket || {};

  // console.log("treding:", trendingCoins, topGainers)


  const filteredAssets = data
    ? data.filter(asset =>
      (asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeCategory === 'all' || getCategoryForAsset(asset) === activeCategory)
    )
    : [];

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 flex flex-col">
      <div className="flex-grow">
        <div className="mb-6 md:mb-8 flex flex-col items-center justify-center gap-4">
            <img src="./logo.png" alt="Kriptomarket Logo" className="w-[15rem] sm:w-[20rem]" />
          <p className='text-center'>Empowering your crypto journey with trust and transparency.</p>
        </div>
        <div className="mb-4 md:mb-6 flex justify-center">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-gray-800 text-white border-2 md:border-2 border-white focus:outline-none"
            />
            <SearchIcon className="absolute right-4 top-3 text-white" />
          </div>
        </div>
        <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        {/* Market Overview, Trending, and Top Gainers */}
        {/* {!marketIsLoading && !marketError && globalData && trendingCoins && topGainers && (
          <div className="w-full flex items-center justify-center flex-wrap gap-8 mb-8">
            Market Overview 
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white">Cryptocurrency Market Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400">Market Cap</p>
                  <p className="text-xl font-bold text-white">${formatNumber(globalData?.data?.total_market_cap?.usd)}</p>
                  <p className={`text-sm ${globalData?.data?.market_cap_change_percentage_24h?.usd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {globalData?.data?.market_cap_change_percentage_24h?.usd >= 0 ? <ArrowUpIcon className="inline w-4 h-4 mr-1" /> : <ArrowDownIcon className="inline w-4 h-4 mr-1" />}
                    {Math.abs(globalData?.data?.market_cap_change_percentage_24h?.usd).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">24h Trading Volume</p>
                  <p className="text-xl font-bold text-white">${formatNumber(globalData.data.total_volume.usd)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Bitcoin Dominance</p>
                  <p className="text-xl font-bold text-white">{globalData.data.market_cap_percentage.btc.toFixed(2)}%</p>
                </div>
              </div>
            </div>

            Trending Coins
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
                <Flame className="mr-2 text-orange-500" /> Trending
              </h2>
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <ul className="space-y-3">
                  {trendingCoins.coins.slice(0, 3).map((item) => (
                    <li key={item.item.id} className="flex justify-between items-center py-3 px-2 hover:bg-gray-700 transition-colors duration-200 rounded">
                      <div className="flex items-center">
                        <img src={item.item.small} alt={item.item.name} className="w-10 h-10 mr-4 rounded-full" />
                        <div>
                          <h3 className="font-semibold text-white">{item.item.name}</h3>
                          <p className="text-sm text-gray-400">{item.item.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-semibold ${item?.item?.data?.price_change_percentage_24h?.usd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {item?.item?.data?.price_change_percentage_24h?.usd >= 0 ? <ArrowUpIcon className="inline w-4 h-4 mr-1" /> : <ArrowDownIcon className="inline w-4 h-4 mr-1" />}
                        {Math.abs(item?.item?.data?.price_change_percentage_24h?.usd).toFixed(2)}%
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            Top Gainers
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
                <TrendingUpIcon className="mr-2 text-green-500" /> Top Gainers
              </h2>
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <ul className="space-y-3">
                  {topGainers.map((coin) => (
                    <li key={coin.id} className="flex justify-between items-center py-3 px-2 hover:bg-gray-700 transition-colors duration-200 rounded">
                      <div className="flex items-center">
                        <img src={coin.image} alt={coin.name} className="w-10 h-10 mr-4 rounded-full" />
                        <div>
                          <h3 className="font-semibold text-white">{coin.name}</h3>
                          <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-semibold ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin.price_change_percentage_24h >= 0 ? <ArrowUpIcon className="inline w-4 h-4 mr-1" /> : <ArrowDownIcon className="inline w-4 h-4 mr-1" />}
                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>



          </div>

        )} */}
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
              <div className="col-span-full text-center text-xl md:text-2xl font-bold mt-10 text-red-600">
                Error: Unable to fetch data.
              </div>
            ) : (
              filteredAssets.map((asset) => <CoinListItem key={asset.id} asset={asset} />)
            )}
          </div>
        </div>
        {/* {!isLoading && !error && (
          <p className="text-center mt-6 md:mt-8 text-lg md:text-xl">
            Displaying {filteredAssets.length} out of {data ? data.length : 0} cryptocurrencies
          </p>
        )} */}
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
