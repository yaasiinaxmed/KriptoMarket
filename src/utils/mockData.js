export const mockCryptoData = [
  {
    baseToken: {
      name: "Bitcoin",
      symbol: "BTC",
      address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    },
    quoteToken: {
      symbol: "USDT",
    },
    priceUsd: 50000,
    priceChange: {
      h24: 2.5,
    },
    liquidity: {
      usd: 1000000000,
    },
    volume: {
      h24: 500000000,
    },
    chainId: "1",
    pairAddress: "0x1234567890123456789012345678901234567890",
  },
  {
    baseToken: {
      name: "Ethereum",
      symbol: "ETH",
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    },
    quoteToken: {
      symbol: "USDT",
    },
    priceUsd: 3000,
    priceChange: {
      h24: -1.2,
    },
    liquidity: {
      usd: 500000000,
    },
    volume: {
      h24: 250000000,
    },
    chainId: "1",
    pairAddress: "0x0987654321098765432109876543210987654321",
  },
  // Add more mock data as needed
];

export const fetchMockData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCryptoData);
    }, 500); // Simulate network delay
  });
};