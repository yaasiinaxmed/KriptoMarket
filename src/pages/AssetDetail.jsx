import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, ArrowUpIcon, ArrowDownIcon, Globe, Twitter, Github, FileText, Copy, Check } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const fetchAssetData = async (pairAddress) => {
  const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/${pairAddress}`);
  if (!response.ok) throw new Error('Network response was not ok');
  const data = await response.json();
  return data.pair;
};

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

const AssetInfo = ({ asset }) => (
  <div className="mb-6">
    <div className="flex items-center mb-4">
      <img src={asset.baseToken.logoURI || 'https://via.placeholder.com/64'} alt={asset.baseToken.name} className="w-12 h-12 mr-4" />
      <h1 className="text-2xl md:text-4xl font-black">{asset.baseToken.name} ({asset.baseToken.symbol.toUpperCase()})</h1>
    </div>
    <p className="text-xl md:text-2xl font-bold mb-2">Price: {formatNumber(asset.priceUsd)}</p>
    <p className="text-lg md:text-xl mb-2">Liquidity: {formatLargeNumber(asset.liquidity.usd)}</p>
    <p className="text-lg md:text-xl mb-2">
      24h Change: 
      <span className={asset.priceChange.h24 >= 0 ? 'text-green-500' : 'text-red-500'}>
        {asset.priceChange.h24 >= 0 ? <ArrowUpIcon className="inline w-4 h-4 mr-1" /> : <ArrowDownIcon className="inline w-4 h-4 mr-1" />}
        {Math.abs(asset.priceChange.h24).toFixed(2)}%
      </span>
    </p>
  </div>
);

const AssetLinks = ({ asset }) => (
  <div className="mb-6">
    <h2 className="text-xl md:text-2xl font-bold mb-4">Links</h2>
    <div className="flex flex-wrap gap-4">
      {asset.url && (
        <Button variant="outline" asChild className="bg-gray-800 hover:bg-gray-700 text-white">
          <a href={asset.url} target="_blank" rel="noopener noreferrer">
            <Globe className="mr-2 h-4 w-4" /> Website
          </a>
        </Button>
      )}
    </div>
  </div>
);

const ContractAddress = ({ address }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Contract address copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg md:text-xl font-bold mb-2">Contract Address:</h3>
      <div className="flex items-center">
        <p className="break-all mr-2 text-sm md:text-base">{address}</p>
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-800 hover:bg-gray-700 text-white"
          onClick={() => copyToClipboard(address)}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

const PriceChart = ({ symbol, address }) => (
  <div className="h-full">
    <h2 className="text-xl md:text-2xl font-bold mb-4">Price Chart</h2>
    <div className="tradingview-widget-container h-[calc(100%-2rem)]">
      <div id="tradingview_chart" className="h-full"></div>
    </div>
  </div>
);

const AssetDetailContent = ({ asset }) => (
  <div className='flex flex-col lg:flex-row gap-6'>
    <div className="flex flex-col gap-6 w-full lg:w-[40%]">
      <div className="bg-gray-800 rounded-lg p-4 md:p-6">
        <AssetInfo asset={asset} />
        <AssetLinks asset={asset} />
        <ContractAddress address={asset.pairAddress} />
      </div>
    </div>
    <div className="bg-gray-800 rounded-lg p-4 md:p-6 w-full lg:w-[60%] h-[400px] md:h-[600px] lg:h-auto">
      <PriceChart symbol={asset.baseToken.symbol} address={asset.pairAddress} />
    </div>
  </div>
);

const AssetDetailSkeleton = () => (
  <div className='flex flex-col lg:flex-row gap-6'>
    <div className="flex flex-col gap-6 w-full lg:w-[40%]">
      <div className="bg-gray-800 rounded-lg p-4 md:p-6">
        <Skeleton className="h-12 w-3/4 mb-4 bg-gray-700" />
        <Skeleton className="h-6 w-1/2 mb-2 bg-gray-700" />
        <Skeleton className="h-6 w-2/3 mb-2 bg-gray-700" />
        <Skeleton className="h-6 w-1/3 mb-4 bg-gray-700" />
        <Skeleton className="h-8 w-1/3 mb-4 bg-gray-700" />
        <div className="flex flex-wrap gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 bg-gray-700" />
          ))}
        </div>
      </div>
    </div>
    <div className="bg-gray-800 rounded-lg p-4 md:p-6 w-full lg:w-[60%] h-[400px] md:h-[600px] lg:h-auto">
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
    refetchInterval: 60000,
  });

  React.useEffect(() => {
    if (asset) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        new window.TradingView.widget({
          autosize: true,
          symbol: asset.pairAddress,
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
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 lg:p-8">
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
  );
};

export default AssetDetail;
