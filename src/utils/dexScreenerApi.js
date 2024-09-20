import { toast } from "sonner";

const DEX_SCREENER_API_URL = 'https://api.dexscreener.com/latest/dex/search';

export const fetchDexScreenerData = async () => {
  try {
    const response = await fetch(`${DEX_SCREENER_API_URL}?q=*`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.pairs || [];
  } catch (error) {
    console.error('Error fetching DexScreener data:', error);
    toast.error('Failed to fetch data from DexScreener');
    return [];
  }
};

export const getCategoryForAsset = (asset) => {
  if (!asset || !asset.baseToken) return 'other';
  
  const name = asset.baseToken.name.toLowerCase();
  const symbol = asset.baseToken.symbol.toLowerCase();

  if (name.includes('doge') || name.includes('shib') || symbol.includes('pepe') || symbol.includes('wif') || symbol.includes('floki') || symbol.includes('bonk')) {
    return 'meme';
  } else if (name.includes('ai') || name.includes('artificial intelligence')) {
    return 'ai';
  } else if (['btc', 'eth', 'sol', 'ada', 'dot'].includes(symbol)) {
    return 'layer1';
  } else if (['matic', 'arb', 'op'].includes(symbol)) {
    return 'layer2';
  }
  return 'other';
};
