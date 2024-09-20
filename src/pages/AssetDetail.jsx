import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, ArrowUpIcon, ArrowDownIcon, Globe, Twitter, Github, FileText } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const fetchAssetData = async (id) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=true`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

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

const AssetDetailContent = ({ asset }) => (
  <>
    <div className="crypto-card mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="flex items-center mb-4">
          <img
            src={asset.image.large}
            alt={asset.name}
            className="w-12 h-12 mr-4"
          />
          <h1 className="text-4xl font-black">{asset.name} ({asset.symbol.toUpperCase()})</h1>
        </div>
        <p className="text-2xl font-bold mb-2">Price: {formatNumber(asset.market_data.current_price.usd)}</p>
        <p className="text-xl mb-2">Market Cap: {formatLargeNumber(asset.market_data.market_cap.usd)}</p>
        <p className="text-xl mb-2">24h Change: 
          <span className={asset.market_data.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}>
            {asset.market_data.price_change_percentage_24h > 0 ? <ArrowUpIcon className="inline w-4 h-4 mr-1" /> : <ArrowDownIcon className="inline w-4 h-4 mr-1" />}
            {Math.abs(asset.market_data.price_change_percentage_24h).toFixed(2)}%
          </span>
        </p>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Links</h2>
        <div className="flex flex-wrap gap-4">
          {asset.links.homepage[0] && (
            <Button variant="outline" asChild>
              <a href={asset.links.homepage[0]} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" /> Website
              </a>
            </Button>
          )}
          {asset.links.twitter_screen_name && (
            <Button variant="outline" asChild>
              <a href={`https://twitter.com/${asset.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer">
                <Twitter className="mr-2 h-4 w-4" /> Twitter
              </a>
            </Button>
          )}
          {asset.links.repos_url.github[0] && (
            <Button variant="outline" asChild>
              <a href={asset.links.repos_url.github[0]} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> GitHub
              </a>
            </Button>
          )}
          {asset.links.whitepaper && (
            <Button variant="outline" asChild>
              <a href={asset.links.whitepaper} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" /> Whitepaper
              </a>
            </Button>
          )}
        </div>
        {asset.contract_address && (
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">Contract Address:</h3>
            <p className="break-all">{asset.contract_address}</p>
          </div>
        )}
      </div>
    </div>
    <div className="crypto-card mb-8">
      <h2 className="text-2xl font-bold mb-4">About {asset.name}</h2>
      <p className="text-sm" dangerouslySetInnerHTML={{ __html: asset.description.en }}></p>
    </div>
    <div className="crypto-card">
      <h2 className="text-2xl font-bold mb-4">Price Chart</h2>
      <div className="tradingview-widget-container">
        <div id="tradingview_chart"></div>
      </div>
    </div>
  </>
);

const AssetDetailSkeleton = () => (
  <>
    <div className="crypto-card mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="flex items-center mb-4">
          <Skeleton className="w-12 h-12 mr-4 rounded-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-6 w-2/3 mb-2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
      <div>
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="flex flex-wrap gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24" />
          ))}
        </div>
      </div>
    </div>
    <div className="crypto-card mb-8">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <div className="crypto-card">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <Skeleton className="w-full h-[400px]" />
    </div>
  </>
);

const AssetDetail = () => {
  const { id } = useParams();
  const { data: asset, isLoading, error } = useQuery({
    queryKey: ['assetDetail', id],
    queryFn: () => fetchAssetData(id),
    refetchInterval: 60000, // Refetch every minute for real-time updates
  });

  React.useEffect(() => {
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
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <Link to="/" className="inline-flex items-center text-white mb-6 hover:underline">
        <ArrowLeftIcon className="mr-2" /> Back to list
      </Link>
      {isLoading ? (
        <AssetDetailSkeleton />
      ) : error ? (
        <div className="text-center text-2xl font-bold mt-10 text-red-600">Error: {error.message}</div>
      ) : (
        <AssetDetailContent asset={asset} />
      )}
    </div>
  );
};

export default AssetDetail;
