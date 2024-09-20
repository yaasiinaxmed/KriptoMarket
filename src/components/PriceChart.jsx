import React from 'react';

const PriceChart = ({ symbol }) => (
  <div className="h-full">
    <h2 className="text-xl md:text-2xl font-bold mb-4">Price Chart</h2>
    <div className="tradingview-widget-container h-[calc(100%-2rem)]">
      <div id="tradingview_chart" className="h-full"></div>
    </div>
  </div>
);

export default PriceChart;