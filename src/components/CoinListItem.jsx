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
        <div className="col-span-1 text-center">{rank}</div>
        <div className="col-span-2 flex items-center">
          <img
            src={`https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`}
            alt={asset.name}
            className="w-6 h-6 mr-2"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://assets.coincap.io/assets/icons/btc@2x.png' }}
          />
          <span className="font-bold">{asset.name}</span>
          <span className="text-gray-400 ml-2">{asset.symbol}</span>
        </div>
        <div className="col-span-1 text-right">{formatNumber(parseFloat(asset.priceUsd))}</div>
        <div className="col-span-1 text-right">
          <span className={parseFloat(asset.changePercent24Hr) >= 0 ? 'text-green-500' : 'text-red-500'}>
            {parseFloat(asset.changePercent24Hr) >= 0 ? <ArrowUpIcon className="inline w-4 h-4 mr-1" /> : <ArrowDownIcon className="inline w-4 h-4 mr-1" />}
            {Math.abs(parseFloat(asset.changePercent24Hr)).toFixed(2)}%
          </span>
        </div>
        <div className="col-span-1 text-right">{formatLargeNumber(parseFloat(asset.marketCapUsd))}</div>
        <div className="col-span-1 text-right">{formatLargeNumber(parseFloat(asset.volumeUsd24Hr))}</div>
        <div className="col-span-1 text-right">{formatLargeNumber(parseFloat(asset.supply))}</div>
      </div>
    </Link>
  );
};

export default CoinListItem;