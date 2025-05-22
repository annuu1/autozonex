import React from 'react'
import TradingViewChartWidget from '../../components/tvWidgets/TradingViewChartWidget'
import HeatMap from '../../components/tvWidgets/HeatMap'
import StockScreener from '../../components/tvWidgets/StockScreener'

function TradeBoard() {
  return (
    <div className="h-screen flex flex-col">
      {/* Heading */}
      <div className=" text-grey-400 text-2xl font-semibold shadow">
        Trade Board Dashboard
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <StockScreener className="flex-1" />
        <HeatMap className="flex-1" />
      </div>
    </div>
  )
}

export default TradeBoard
