import React, { useEffect, useRef, memo, useState } from 'react';

function TradingViewChartWidget() {
  const containerRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!containerRef.current) {
      console.error('Container ref is not available');
      return;
    }

    // Check if script is already loaded to avoid duplicates
    if (document.querySelector('script[src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"]')) {
      console.log('TradingView script already loaded');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: 'NSE:NIFTY',
      interval: 'D',
      timezone: 'Asia/Kolkata', // Changed to Asia/Kolkata for India
      theme: 'light',
      style: '1',
      locale: 'en',
      hide_side_toolbar: false,
      allow_symbol_change: true,
      support_host: 'https://www.tradingview.com'
    });

    script.onload = () => {
      console.log('TradingView script loaded successfully');
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load TradingView script');
      setError('Failed to load chart. Please try again later.');
    };

    containerRef.current.appendChild(script);

    return () => {
      // Cleanup: Remove script and clear container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container" ref={containerRef} style={{ height: '100%', width: '100%' }}>
      <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
      {!scriptLoaded && !error && <div className="text-center">Loading NIFTY chart...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
    </div>
  );
}

export default memo(TradingViewChartWidget);