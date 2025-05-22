// components/tvWidgets/StockScreener.jsx
import React, { useEffect, useRef, useState, memo } from 'react';

function StockScreener() {
  const containerRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!containerRef.current) {
      console.error('StockScreener container ref is not available');
      return;
    }

    // Prevent duplicate script loading
    if (document.querySelector('script[src="https://s3.tradingview.com/external-embedding/embed-widget-screener.js"]')) {
      console.log('StockScreener script already loaded');
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: 550,
      defaultColumn: 'overview',
      defaultScreen: 'top_gainers',
      market: 'india',
      showToolbar: true,
      colorTheme: 'light',
      locale: 'en'
    });

    script.onload = () => {
      console.log('StockScreener script loaded successfully');
      setScriptLoaded(true);
    };
    script.onerror = () => setError('Failed to load Stock Screener.');

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="tradingview-widget-container" ref={containerRef} style={{ height: '550px', width: '100%' }}>
      <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(StockScreener);