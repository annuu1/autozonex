import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { fetchZones, fetchCandles } from '../services/api';

const StockChart = ({ ticker, timeFrame = '1d', selectedZone = null, alerts = [] }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const priceLinesRef = useRef([]);

  useEffect(() => {
    const symbol = ticker.toUpperCase().endsWith('.NS') ? ticker.toUpperCase() : `${ticker.toUpperCase()}.NS`;
    console.log('Chart component mounted with ticker:', ticker);

    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: 'black',
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      grid: {
        vertLines: { color: '#e0e0e0' },
        horzLines: { color: '#e0e0e0' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });
    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    candlestickSeriesRef.current = candlestickSeries;

    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };
    window.addEventListener('resize', handleResize);

    const loadChartData = async () => {
      try {
        // Fetch candles
        const candles = await fetchCandles(symbol, timeFrame);
        console.log('Fetched candles:', candles);
        candlestickSeries.setData(candles);

        // Add price lines for zones
        if (selectedZone) {
          candlestickSeries.createPriceLine({
            price: selectedZone.proximalLine,
            color: 'rgba(0, 150, 136, 0.5)',
            lineWidth: 2,
            lineStyle: 0,
            axisLabelVisible: true,
            title: `Proximal (${selectedZone.pattern})`,
          });
          candlestickSeries.createPriceLine({
            price: selectedZone.distalLine,
            color: 'rgba(150, 0, 105, 0.5)',
            lineWidth: 2,
            lineStyle: 0,
            axisLabelVisible: true,
            title: `Distal (${selectedZone.pattern})`,
          });
        } else {
          try {
            const fetchedZones = await fetchZones(ticker, timeFrame);
            fetchedZones.forEach((zone) => {
              if (zone.freshness > 0) {
                candlestickSeries.createPriceLine({
                  price: zone.proximalLine,
                  color: 'rgba(0, 150, 136, 0.5)',
                  lineWidth: 2,
                  lineStyle: 0,
                  axisLabelVisible: true,
                  title: `P (${zone.pattern})`,
                });
                candlestickSeries.createPriceLine({
                  price: zone.distalLine,
                  color: 'rgba(0, 150, 136, 0.5)',
                  lineWidth: 2,
                  lineStyle: 0,
                  axisLabelVisible: true,
                  title: `D (${zone.pattern})`,
                });
              }
            });
          } catch (zoneError) {
            console.error('Failed to fetch zones:', zoneError);
          }
        }

        // Add price lines for unsent alerts
        alerts
          .filter((alert) => alert.triggerNotificationStatus === 'Not Sent')
          .forEach((alert, index) => {
            const priceLine = candlestickSeries.createPriceLine({
              price: alert.alertPrice,
              color: alert.condition === 'Above' ? '#4caf50' : '#f44336',
              lineWidth: 1,
              lineStyle: 0, // Dashed line to differentiate from zones
              axisLabelVisible: true,
              title: `Alert-${index+1}`,
            });
            priceLinesRef.current.push(priceLine);
          });

        chart.timeScale().fitContent();
      } catch (error) {
        console.error('Failed to load chart data:', error);
      }
    };

    loadChartData();

    return () => {
      console.log('Cleaning up chart');
      window.removeEventListener('resize', handleResize);
      // Remove price lines
      priceLinesRef.current.forEach((priceLine) => {
        try {
          candlestickSeries.removePriceLine(priceLine);
        } catch (err) {
          console.error('Error removing price line:', err);
        }
      });
      priceLinesRef.current = [];
      chart.remove();
    };
  }, [ticker, timeFrame, selectedZone, alerts]);

  return (
    <div className="relative w-full">
      <div ref={chartContainerRef} className="w-full h-[500px]" />
    </div>
  );
};

export default StockChart;