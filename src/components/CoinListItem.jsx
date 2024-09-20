import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const CoinListItem = ({ asset, rank }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
      <div className="grid grid-cols-8 items-center py-4 px-2 border-b border-gray-700 text-sm">
        <div className="col-span-1 text-center">{asset.market_cap_rank}</div>
        <div className="col-span-2 flex items-center">
          <img
            src={asset.image}
            alt={asset.name}
            className="w-6 h-6 mr-2"
          />
          <span className="font-bold">{asset.name}</span>
          <span className="text-gray-400 ml-2">{asset.symbol.toUpperCase()}</span>
        </div>
        <div className="col-span-1 text-right">{formatNumber(asset.current_price)}</div>
        <div className="col-span-1 text-right">
          <span className={asset.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
            {asset.price_change_percentage_24h >= 0 ? <ArrowUpIcon className="inline w-4 h-4 mr-1" /> : <ArrowDownIcon className="inline w-4 h-4 mr-1" />}
            {Math.abs(asset.price_change_percentage_24h).toFixed(2)}%
          </span>
        </div>
        <div className="col-span-1 text-right">{formatLargeNumber(asset.market_cap)}</div>
        <div className="col-span-1 text-right">{formatLargeNumber(asset.total_volume)}</div>
        <div className="col-span-1 text-right">{formatLargeNumber(asset.circulating_supply)} {asset.symbol.toUpperCase()}</div>
      </div>
    </Link>
  );
};

export default CoinListItem;
