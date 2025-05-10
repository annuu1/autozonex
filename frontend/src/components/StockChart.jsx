import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { fetchCandles, fetchZones } from '../services/api';

const StockChart = ({ ticker, timeFrame }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeChart = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch candlestick and zone data
        const [candles, zones] = await Promise.all([
          fetchCandles(ticker, timeFrame),
          fetchZones(ticker, timeFrame),
        ]);

        // Initialize chart
        const chart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: 500,
          layout: {
            background: { type: ColorType.Solid, color: '#ffffff' },
            textColor: '#333',
          },
          grid: {
            vertLines: { color: '#e0e0e0' },
            horzLines: { color: '#e0e0e0' },
          },
          timeScale: { timeVisible: true, secondsVisible: false },
          attributionLogo: true, // Show TradingView attribution
        });
        chartRef.current = chart;

        // Add candlestick series
        const candleSeries = chart.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });
        candleSeries.setData(candles);

        // Add demand zones as PriceRange primitives
        zones.forEach(zone => {
          candleSeries.createPriceLine({
            price: zone.proximalLine,
            color: 'rgba(0, 150, 136, 0.3)',
            lineWidth: 1,
            lineStyle: 2, // Dashed
            axisLabelVisible: false,
          });
          candleSeries.createPriceLine({
            price: zone.distalLine,
            color: 'rgba(0, 150, 136, 0.3)',
            lineWidth: 1,
            lineStyle: 2, // Dashed
            axisLabelVisible: false,
          });
          // Add a filled rectangle for the zone
          candleSeries.setMarkers([
            {
              time: zone.legOutDate.split('T')[0], // YYYY-MM-DD
              position: 'inBar',
              shape: 'rectangle',
              color: 'rgba(0, 150, 136, 0.2)',
              size: 1,
              top: zone.proximalLine,
              bottom: zone.distalLine,
            },
          ]);
        });

        // Fit content to time scale
        chart.timeScale().fitContent();

        // Handle resize
        const handleResize = () => {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(chartContainerRef.current);

        // Cleanup
        return () => {
          resizeObserver.disconnect();
          chart.remove();
        };
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeChart();
  }, [ticker, timeFrame]);

  return (
    <div className="relative w-full">
      {loading && <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">Loading...</div>}
      {error && <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-700">{error}</div>}
      <div ref={chartContainerRef} className="w-full" />
      <div className="text-sm text-gray-500 mt-2">
        Chart powered by <a href="https://www.tradingview.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600">TradingView</a>
      </div>
    </div>
  );
};

export default StockChart;