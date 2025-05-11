import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

// Dummy candlestick data (10 days, RELIANCE.NS-like prices)
const dummyCandles = [
  { time: '2025-04-01', open: 3000, high: 3020, low: 2980, close: 3010 },
  { time: '2025-04-02', open: 3010, high: 3030, low: 3000, close: 2995 },
  { time: '2025-04-03', open: 2995, high: 3010, low: 2985, close: 3005 },
  { time: '2025-04-04', open: 3005, high: 3025, low: 2990, close: 3020 },
  { time: '2025-04-05', open: 3020, high: 3040, low: 3015, close: 3035 },
  { time: '2025-04-06', open: 3035, high: 3050, low: 3020, close: 3025 },
  { time: '2025-04-07', open: 3025, high: 3035, low: 3010, close: 3015 },
  { time: '2025-04-08', open: 3015, high: 3020, low: 3000, close: 3005 },
  { time: '2025-04-09', open: 3005, high: 3015, low: 2995, close: 3010 },
  { time: '2025-04-10', open: 3010, high: 3030, low: 3000, close: 3025 },
];

// Dummy demand zones
const dummyZones = [
  {
    ticker: 'RELIANCE.NS',
    timeFrame: '1d',
    type: 'demand',
    pattern: 'DBR',
    proximalLine: 3005,
    distalLine: 2995,
    tradeScore: 5,
    legOutDate: '2025-04-03',
  },
  {
    ticker: 'RELIANCE.NS',
    timeFrame: '1d',
    type: 'demand',
    pattern: 'RBR',
    proximalLine: 3020,
    distalLine: 3010,
    tradeScore: 4.5,
    legOutDate: '2025-04-08',
  },
];

const StockChart = ({ ticker, timeFrame }) => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    console.log(`Initializing chart for ${ticker} (${timeFrame})`);

    // Initialize chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: 'black',
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: '#e0e0e0' },
        horzLines: { color: '#e0e0e0' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Add candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    candlestickSeries.setData(dummyCandles);
    console.log('Candlestick series added and data set');

    // Add demand zones as price lines
    dummyZones.forEach(zone => {
      candlestickSeries.createPriceLine({
        price: zone.proximalLine,
        color: 'rgba(0, 150, 136, 0.5)',
        lineWidth: 2,
        lineStyle: 0,
        axisLabelVisible: true,
        title: `Zone Top (${zone.pattern})`,
      });
      candlestickSeries.createPriceLine({
        price: zone.distalLine,
        color: 'rgba(0, 150, 136, 0.5)',
        lineWidth: 2,
        lineStyle: 0,
        axisLabelVisible: true,
        title: `Zone Bottom (${zone.pattern})`,
      });
    });
    console.log('Demand zones added');

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      console.log('Cleaning up chart');
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [ticker, timeFrame]);

  return (
    <div className="relative w-full">
      <div ref={chartContainerRef} className="w-full h-[400px]" />
      <div className="text-sm text-gray-500 mt-2">
        Chart powered by{' '}
        <a href="https://www.tradingview.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600">
          TradingView
        </a>
      </div>
    </div>
  );
};

export default StockChart;