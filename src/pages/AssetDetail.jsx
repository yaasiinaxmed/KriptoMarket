import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeftIcon } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const fetchAssetData = async (id) => {
  const [assetResponse, historyResponse] = await Promise.all([
    fetch(`https://api.coincap.io/v2/assets/${id}`),
    fetch(`https://api.coincap.io/v2/assets/${id}/history?interval=d1`)
  ]);

  if (!assetResponse.ok || !historyResponse.ok) {
    throw new Error('Network response was not ok');
  }

  const [assetData, historyData] = await Promise.all([
    assetResponse.json(),
    historyResponse.json()
  ]);

  return { asset: assetData.data, history: historyData.data };
};

const AssetDetailContent = ({ asset, history }) => (
  <>
    <div className="crypto-card mb-8">
      <div className="flex items-center mb-4">
        <img
          src={`https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`}
          alt={asset.name}
          className="w-12 h-12 mr-4"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://assets.coincap.io/assets/icons/btc@2x.png' }}
        />
        <h1 className="text-4xl font-black">{asset.name} ({asset.symbol})</h1>
      </div>
      <p className="text-2xl font-bold mb-2">Price: ${parseFloat(asset.priceUsd).toFixed(2)}</p>
      <p className="text-xl mb-2">Market Cap: ${parseFloat(asset.marketCapUsd).toFixed(2)}</p>
      <p className="text-xl mb-2">24h Change: 
        <span className={asset.changePercent24Hr > 0 ? 'text-green-500' : 'text-red-500'}>
          {parseFloat(asset.changePercent24Hr).toFixed(2)}%
        </span>
      </p>
    </div>
    <div className="crypto-card">
      <h2 className="text-2xl font-bold mb-4">Price History (Last 30 Days)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={history.slice(-30)}>
          <XAxis dataKey="date" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
          <Line type="monotone" dataKey="priceUsd" stroke="#fff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </>
);

const AssetDetailSkeleton = () => (
  <>
    <div className="crypto-card mb-8">
      <div className="flex items-center mb-4">
        <Skeleton className="w-12 h-12 mr-4 rounded-full" />
        <Skeleton className="h-8 w-3/4" />
      </div>
      <Skeleton className="h-6 w-1/2 mb-2" />
      <Skeleton className="h-6 w-2/3 mb-2" />
      <Skeleton className="h-6 w-1/3" />
    </div>
    <div className="crypto-card">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <Skeleton className="w-full h-[400px]" />
    </div>
  </>
);

const AssetDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['assetDetail', id],
    queryFn: () => fetchAssetData(id),
  });

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link to="/" className="inline-flex items-center text-white mb-6 hover:underline">
        <ArrowLeftIcon className="mr-2" /> Back to list
      </Link>
      {isLoading ? (
        <AssetDetailSkeleton />
      ) : error ? (
        <div className="text-center text-2xl font-bold mt-10 text-red-600">Error: {error.message}</div>
      ) : (
        <AssetDetailContent asset={data.asset} history={data.history} />
      )}
    </div>
  );
};

export default AssetDetail;
