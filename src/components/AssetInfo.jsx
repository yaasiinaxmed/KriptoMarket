import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const formatNumber = (num) => {
  if (num < 0.000001) return num.toExponential(2);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(num);
};

const formatLargeNumber = (num) => {
  if (num > 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num > 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num > 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
};

const translations = {
  en: {
    price: "Price",
    marketCap: "Market Cap",
    change24h: "24h Change",
  },
  so: {
    price: "Qiimaha",
    marketCap: "Suuqa Xaddiga",
    change24h: "24h Isbeddelka",
  }
};

const AssetInfo = ({ asset, language }) => {
  const t = translations[language];

  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <img src={asset.image.large} alt={asset.name} className="w-12 h-12 mr-4" />
        <h1 className="text-2xl md:text-4xl font-black">{asset.name} ({asset.symbol.toUpperCase()})</h1>
      </div>
      <p className="text-xl md:text-2xl font-bold mb-2">{t.price}: {formatNumber(asset.market_data.current_price.usd)}</p>
      <p className="text-lg md:text-xl mb-2">{t.marketCap}: {formatLargeNumber(asset.market_data.market_cap.usd)}</p>
      <p className="text-lg md:text-xl mb-2">
        {t.change24h}: 
        <span className={asset.market_data.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}>
          {asset.market_data.price_change_percentage_24h > 0 ? <ArrowUpIcon className="inline w-4 h-4 mr-1" /> : <ArrowDownIcon className="inline w-4 h-4 mr-1" />}
          {Math.abs(asset.market_data.price_change_percentage_24h).toFixed(2)}%
        </span>
      </p>
    </div>
  );
};

export default AssetInfo;