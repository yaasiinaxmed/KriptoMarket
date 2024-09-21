import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const CoinListItem = ({ asset }) => {
  const formatNumber = (num) => {
    if (num < 0.000001) {
      return num.toExponential(2);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(num);
  };

  const formatLargeNumber = (num) => {
    if (num > 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num > 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num > 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  return (
    <Link to={`/asset/${asset.id}`} className="block hover:bg-gray-800 transition-colors duration-200">
      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-4 items-center py-2 md:py-3 lg:py-4 px-2 md:px-3 lg:px-4 border-b border-gray-700 text-xs md:text-sm">
        <div className="col-span-2 flex items-center">
          <span className="font-bold mr-2 w-6 md:w-8 text-right">{asset.market_cap_rank}</span>
          <img
            src={asset.image}
            alt={asset.name}
            className="w-5 h-5 md:w-6 md:h-6 mr-2"
          />
          <span className="font-bold truncate">{asset.name}</span>
          <span className="text-gray-400 ml-1 hidden sm:inline">{asset.symbol.toUpperCase()}</span>
        </div>
        <div className="text-right">{formatNumber(asset.current_price)}</div>
        <div className="text-right">
          <span className={asset.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
            {asset.price_change_percentage_24h >= 0 ? <ArrowUpIcon className="inline w-3 h-3 md:w-4 md:h-4 mr-1" /> : <ArrowDownIcon className="inline w-3 h-3 md:w-4 md:h-4 mr-1" />}
            {Math.abs(asset.price_change_percentage_24h).toFixed(2)}%
          </span>
        </div>
        <div className="text-right hidden md:block">{formatLargeNumber(asset.market_cap)}</div>
        <div className="text-right hidden md:block">{formatLargeNumber(asset.total_volume)}</div>
        <div className="text-right hidden lg:block">{formatLargeNumber(asset.circulating_supply)} {asset.symbol.toUpperCase()}</div>
      </div>
    </Link>
  );
};

export default CoinListItem;
