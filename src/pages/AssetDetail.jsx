import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import AssetInfo from '../components/AssetInfo';
import AssetLinks from '../components/AssetLinks';
import ContractAddress from '../components/ContractAddress';
import AssetDescription from '../components/AssetDescription';
import Layout from '../components/Layout';

const AssetDetail = () => {
  const mockAsset = {
    name: 'Bitcoin',
    symbol: 'BTC',
    market_data: {
      current_price: { usd: 50000 },
      market_cap: { usd: 1000000000000 },
      price_change_percentage_24h: 5.5
    },
    image: { large: 'https://example.com/bitcoin.png' },
    links: {
      homepage: ['https://bitcoin.org'],
      twitter_screen_name: 'bitcoin',
      repos_url: { github: ['https://github.com/bitcoin/bitcoin'] },
    },
    contract_address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8'
  };

  return (
    <Layout>
      <Link to="/" className="inline-flex items-center text-white mb-6 hover:underline">
        <ArrowLeftIcon className="mr-2" /> Back to list
      </Link>
      <div className='flex flex-col lg:flex-row gap-6'>
        <div className="flex flex-col gap-6 w-full lg:w-[40%]">
          <div className="bg-gray-800 rounded-lg p-6">
            <AssetInfo asset={mockAsset} />
            <AssetLinks asset={mockAsset} />
            <ContractAddress address={mockAsset.contract_address} />
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <AssetDescription />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 w-full lg:w-[60%] h-[400px] md:h-[600px] lg:h-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Price Chart</h2>
          <p>Chart functionality is not available in this simplified version.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AssetDetail;
