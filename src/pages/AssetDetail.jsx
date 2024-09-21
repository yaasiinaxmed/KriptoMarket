import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import AssetInfo from '../components/AssetInfo';
import AssetLinks from '../components/AssetLinks';
import AssetDescription from '../components/AssetDescription';
import PriceChart from '../components/PriceChart';

const fetchAssetData = async (id) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=true`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

const AssetDetailContent = ({ asset }) => (
  <div className='flex flex-col lg:flex-row gap-6'>
    <div className="flex flex-col gap-6 w-full lg:w-[40%]">
      <div className="bg-gray-800 rounded-lg p-6">
        <AssetInfo asset={asset} />
        <AssetLinks asset={asset} />
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <AssetDescription description={asset.description.en.split('\n')[0]} />
      </div>
    </div>
    <div className="bg-gray-800 rounded-lg p-6 w-full lg:w-[60%] h-[400px] md:h-[600px] lg:h-auto">
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
    <div className="bg-gray-800 rounded-lg p-6 w-full lg:w-[60%] h-[400px] md:h-[600px] lg:h-auto">
      <Skeleton className="h-8 w-1/3 mb-4 bg-gray-700" />
      <Skeleton className="w-full h-[calc(100%-2rem)] bg-gray-700" />
    </div>
  </div>
);

const AssetDetail = () => {
  const { id } = useParams();
  const { data: asset, isLoading, error } = useQuery({
    queryKey: ['assetDetail', id],
    queryFn: () => fetchAssetData(id),
    refetchInterval: 3000, // Update every 3 seconds
  });

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
          locale: "en",
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
  }, [asset]);

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 lg:p-8 flex flex-col">
      <div className="flex-grow">
        <Link to="/" className="inline-flex items-center text-white mb-6 hover:underline">
          <ArrowLeftIcon className="mr-2" /> Back to list
        </Link>
        {isLoading ? (
          <AssetDetailSkeleton />
        ) : error ? (
          <div className="text-center text-xl md:text-2xl font-bold mt-10 text-red-600">Error: {error.message}</div>
        ) : (
          <AssetDetailContent asset={asset} />
        )}
      </div>
      <footer className="mt-8 text-center text-white">
        <p>
          Created by <a href="https://github.com/yaasiinaxmed" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">Yasin Ahmed</a>
        </p>
      </footer>
    </div>
  );
};

export default AssetDetail;
