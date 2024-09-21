import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe, Twitter, Github, FileText, DollarSign } from 'lucide-react';

const AssetLinks = ({ asset }) => (
  <div className="mt-4">
    <h2 className="text-lg font-bold mb-2">Links</h2>
    <div className="grid grid-cols-2 gap-2">
      {asset.links.homepage[0] && (
        <Button variant="outline" asChild className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white">
          <a href={asset.links.homepage[0]} target="_blank" rel="noopener noreferrer">
            <Globe className="mr-2 h-4 w-4" /> Website
          </a>
        </Button>
      )}
      {asset.links.twitter_screen_name && (
        <Button variant="outline" asChild className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white">
          <a href={`https://twitter.com/${asset.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer">
            <Twitter className="mr-2 h-4 w-4" /> Twitter
          </a>
        </Button>
      )}
      {asset.links.repos_url.github[0] && (
        <Button variant="outline" asChild className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white">
          <a href={asset.links.repos_url.github[0]} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" /> GitHub
          </a>
        </Button>
      )}
      {asset.links.whitepaper && (
        <Button variant="outline" asChild className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white">
          <a href={asset.links.whitepaper} target="_blank" rel="noopener noreferrer">
            <FileText className="mr-2 h-4 w-4" /> Whitepaper
          </a>
        </Button>
      )}
    </div>

    <h2 className="text-lg font-bold mt-4 mb-2">Available Exchanges</h2>
    <div className="bg-gray-800 rounded-lg p-2">
      <div className="max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
        {asset.tickers.map((ticker, index) => (
          <Button 
            key={index} 
            variant="outline" 
            asChild 
            className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white mb-2 last:mb-0"
          >
            <a href={ticker.trade_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
              {ticker.exchange_logo ? (
                <img 
                  src={ticker.exchange_logo} 
                  alt={`${ticker.market.name} logo`} 
                  className="w-6 h-6 mr-2 rounded-full"
                  onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.svg'; }}
                />
              ) : (
                <DollarSign className="mr-2 h-6 w-6" />
              )}
              <span className="truncate">{ticker.market.name}</span>
            </a>
          </Button>
        ))}
      </div>
    </div>
  </div>
);

export default AssetLinks;
