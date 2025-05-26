import React, {useEffect, useState} from "react";
import ListItemLayout from "../../components/layouts/ItemDetailsLayout";

import { getAllPriceActions } from "../../api/priceAction";

const PriceActions = () => {
    const [selected, setSelected] = useState(null);

    const [items, setItems] = useState([])

      // const items = [
      //   {
      //     _id: "1",
      //     symbol: "TCS",
      //     follows_demand_supply: true,
      //     trend_direction_HTF: "Uptrend",
      //     current_EMA_alignment: "Above all EMAs",
      //     notes: "Aggressive reaction at demand zone",
      //   },
      //   {
      //     _id: "2",
      //     symbol: "RELIANCE",
      //     follows_demand_supply: false,
      //     trend_direction_HTF: "Sideways",
      //     current_EMA_alignment: "Between EMAs",
      //     notes: "Choppy price action",
      //   },
      // ];

      useEffect(()=>{
        const fetchPA = async()=>{
            const res = await getAllPriceActions();
            const pa = res.map((pa)=>{
                return {
                    _id: pa._id,
                    symbol: pa.stock.symbol,
                    follows_demand_supply: pa.follows_demand_supply,
                    trend_direction_HTF: pa.trend_direction_HTF,
                    current_EMA_alignment: pa.current_EMA_alignment,
                    notes: pa.notes,
                }
            })
            setItems(pa);
        }
        fetchPA();
      },[])
    
      const renderDetails = (item) => (
        <div>
          <h2 className="text-2xl font-bold mb-4">{item.symbol} Details</h2>
          <p className="text-gray-600 mb-2">
            Follows Demand Supply: {item.follows_demand_supply ? "✅" : "❌"}
          </p>
          <p className="text-gray-600 mb-2">
            Trend Direction HTF: {item.trend_direction_HTF}
          </p>
          <p className="text-gray-600 mb-2">
            EMA Alignment: {item.current_EMA_alignment}
          </p>
          <p className="text-gray-600">Notes: {item.notes}</p>
        </div>
      );
    
      return (
        <ListItemLayout
          items={items}
          selectedItem={selected}
          onSelect={setSelected}
          renderDetails={renderDetails}
        />
      );
    };
    
export default PriceActions;
