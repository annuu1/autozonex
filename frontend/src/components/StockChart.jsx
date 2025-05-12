import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { fetchZones, fetchCandles } from '../services/api';

const StockChart = ({ ticker, timeFrame, selectedZone = null }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

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
        // ✅ Fetch candles dynamically
        const candles = await fetchCandles(ticker, timeFrame);
        console.log('Fetched candles:', candles);

        // ✅ Set fetched candles on chart
        candlestickSeries.setData(candles);

        // ✅ Fetch zones and draw them
        if (selectedZone) {

          candlestickSeries.createPriceLine({
            price: selectedZone.proximalLine,
            color: 'rgba(0, 150, 136, 0.5)',
            lineWidth: 2,
            lineStyle: 0,
            axisLabelVisible: true,
            title: `Zone Top (${selectedZone.pattern})`,
          });
          candlestickSeries.createPriceLine({
            price: selectedZone.distalLine,
            color: 'rgba(0, 150, 136, 0.5)',
            lineWidth: 2,
            lineStyle: 0,
            axisLabelVisible: true,
            title: `Zone Bottom (${selectedZone.pattern})`,
          });
          
        }else{
          const fetchedZones = await fetchZones(ticker, timeFrame);
        console.log('Fetched zones:', fetchedZones);

        fetchedZones.forEach(zone => {
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
        }

        chart.timeScale().fitContent();
      } catch (error) {
        console.error('Failed to load chart data:', error);
      }
    };

    loadChartData();

    return () => {
      console.log('Cleaning up chart');
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [ticker, timeFrame, selectedZone]);

  return (
    <div className="relative w-full">
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
};

export default StockChart;
