import React from 'react';

const PriceChart = ({ symbol }) => (
  <div className="h-full">
    <div className="tradingview-widget-container h-[calc(100%-2rem)]">
      <div id="tradingview_chart" className="h-full"></div>
    </div>
  </div>
);

export default PriceChart;