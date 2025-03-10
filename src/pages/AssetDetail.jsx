import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import AssetInfo from '../components/AssetInfo';
import AssetLinks from '../components/AssetLinks';
import AssetDescription from '../components/AssetDescription';
import PriceChart from '../components/PriceChart';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { translate, translateDescription, getStoredLanguage, setStoredLanguage } from '../utils/translate';

const fetchAssetData = async (id) => {
  const [assetResponse, exchangesResponse] = await Promise.all([
    fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true`),
    fetch('https://api.coingecko.com/api/v3/exchanges')
  ]);

  if (!assetResponse.ok || !exchangesResponse.ok) {
    throw new Error('Network response was not ok');
  }

  const [assetData, exchangesData] = await Promise.all([
    assetResponse.json(),
    exchangesResponse.json()
  ]);

  const exchangeMap = Object.fromEntries(
    exchangesData.map(exchange => [
      exchange.id,
      {
        logo: exchange.image,
        type: exchange.centralized ? 'CEX' : 'DEX'
      }
    ])
  );

  const uniqueTickers = [];
  const seenExchanges = new Set();

  assetData.tickers.forEach(ticker => {
    const exchangeId = ticker.market.identifier;
    if (!seenExchanges.has(exchangeId)) {
      seenExchanges.add(exchangeId);
      uniqueTickers.push({
        ...ticker,
        exchange_logo: exchangeMap[exchangeId]?.logo,
        exchange_type: exchangeMap[exchangeId]?.type || 'Unknown'
      });
    }
  });

  assetData.tickers = uniqueTickers;

  return assetData;
};

const AssetDetailContent = ({ asset, language }) => (
  <div className='flex flex-col lg:flex-row gap-6'>
    <div className="flex flex-col gap-6 w-full lg:w-[40%]">
      <div className="bg-gray-800 rounded-lg p-6">
        <AssetInfo asset={asset} language={language} />
        <AssetLinks asset={asset} language={language} />
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <AssetDescription 
          description={translateDescription(asset.description.en, language)} 
          language={language} 
        />
      </div>
    </div>
    <div className="bg-gray-800 rounded-lg p-3 w-full lg:w-[60%] h-[500px] md:h-[600px] lg:h-[700px]">
      <PriceChart symbol={asset.symbol} />
    </div>
  </div>
);

const AssetDetailSkeleton = () => (
  <div className='flex flex-col lg:flex-row gap-6'>
    <div className="flex flex-col gap-6 w-full lg:w-[40%]">
      <div className="bg-gray-800 rounded-lg p-6">
        <Skeleton className="h-12 w-3/4 mb-4 bg-gray-700" />
        <Skeleton className="h-6 w-1/2 mb-2 bg-gray-700" />
        <Skeleton className="h-6 w-2/3 mb-2 bg-gray-700" />
        <Skeleton className="h-6 w-1/3 mb-4 bg-gray-700" />
        <Skeleton className="h-8 w-1/3 mb-4 bg-gray-700" />
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full bg-gray-700" />
          ))}
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <Skeleton className="h-8 w-1/3 mb-4 bg-gray-700" />
        <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
        <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
        <Skeleton className="h-4 w-2/3 bg-gray-700" />
      </div>
    </div>
    <div className="bg-gray-800 rounded-lg p-6 w-full lg:w-[60%] h-[500px] md:h-[600px] lg:h-[700px]">
      <Skeleton className="h-8 w-1/3 mb-4 bg-gray-700" />
      <Skeleton className="w-full h-[calc(100%-2rem)] bg-gray-700" />
    </div>
  </div>
);

const AssetDetail = () => {
  const { id } = useParams();
  const [language, setLanguage] = useState(getStoredLanguage());
  const { data: asset, isLoading, error } = useQuery({
    queryKey: ['assetDetail', id],
    queryFn: () => fetchAssetData(id),
    refetchInterval: 60000,
  });

  useEffect(() => {
    setStoredLanguage(language);
  }, [language]);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  useEffect(() => {
    if (asset) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        new window.TradingView.widget({
          autosize: true,
          symbol: `${asset.symbol.toUpperCase()}USD`,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: language,
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: "tradingview_chart"
        });
      };
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [asset, language]);

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 lg:p-8 flex flex-col">
      <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
      <div className="flex-grow">
        <Link to="/" className="inline-flex items-center text-white mb-6 hover:underline">
          <ArrowLeftIcon className="mr-2" /> {translate('backToList', language)}
        </Link>
        {isLoading ? (
          <AssetDetailSkeleton />
        ) : error ? (
          <div className="text-center text-xl md:text-2xl font-bold mt-10 text-red-600">Error: {error.message}</div>
        ) : (
          <AssetDetailContent asset={asset} language={language} />
        )}
      </div>
      <footer className="mt-8 bg-gray-800 rounded-lg py-6 text-white">
        <div className="container mx-auto text-center">
          <p className="text-sm mb-4">{translate('footer', language)}</p>
          <p className="mb-4">{translate('empowering', language)}</p>
          <p>
            {translate('builtBy', language)}
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

export default AssetDetail;
