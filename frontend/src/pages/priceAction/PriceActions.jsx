import React, { useState, useEffect } from 'react';
import ModalDialog from "../../components/common/ModalDialog";
import AddPriceActionForm from "../../components/dialogs/AddPriceActionForm";
import { createPriceAction, deletePriceAction, getAllPriceActions, updatePriceAction } from "../../api/priceAction";
import ListItemLayout from "../../components/layouts/ItemDetailsLayout";

const PriceActions = () => {
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchPA = async () => {
      const res = await getAllPriceActions();
      setItems(res || []);
      if (res?.length > 0) {
        setSelected(res[0]);
      }
    };
    fetchPA();
  }, []);

  const handleSubmit = async (data) => {
    if (data._id) {
      // Update existing price action
      await updatePriceAction(data._id, data);
    } else {
      // Create new price action
      await createPriceAction(data);
    }
    const res = await getAllPriceActions();
    const pa = res.map((pa) => ({
      _id: pa._id,
      symbol: typeof pa.symbol === 'string' ? { symbol: pa.symbol, _id: pa.symbol } : pa.symbol,
      follows_demand_supply: pa.follows_demand_supply,
      trend_direction_HTF: pa.trend_direction_HTF,
      current_EMA_alignment: pa.current_EMA_alignment,
      confidence_score: pa.confidence_score,
      notes: pa.notes,
      last_seen: pa.last_seen,
    }));
    setItems(pa);
    setSelected(null);
  };

  const renderDetails = (item) => (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {(typeof item.symbol === 'object' ? item.symbol?.symbol : item.symbol) || 'N/A'} Details
      </h2>
      <p className="text-gray-600 mb-2">
        Follows Demand Supply: {item.follows_demand_supply ? "✅" : "❌"}
      </p>
      <p className="text-gray-600 mb-2">
        Trend Direction HTF: {item.trend_direction_HTF}
      </p>
      <p className="text-gray-600 mb-2">
        EMA Alignment: {item.current_EMA_alignment}
      </p>
      <p className="text-gray-600 mb-2">
        Last Seen: {item.last_seen ? new Date(item.last_seen).toLocaleDateString() : 'N/A'}
      </p>
      <p className="text-gray-600">Notes: {item.notes}</p>
      <AddPriceActionForm
        priceAction={item}
        onSubmit={handleSubmit}
        onCancel={() => setSelected(null)}
      />
    </div>
  );

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <h1 className="text-2xl font-semibold">Price Action Logs</h1>
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add New
        </button>
      </div>

      <ListItemLayout
        items={items}
        selectedItem={selected}
        onSelect={setSelected}
        onDelete={async (id) => {
          await deletePriceAction(id);
          const res = await getAllPriceActions();
          setItems(res);
          if (selected && selected._id === id) setSelected(null);
        }}
        renderDetails={item =>
          item ? renderDetails(item) : (
            <AddPriceActionForm
              onSubmit={handleSubmit}
              onCancel={() => setSelected(null)}
            />
          )
        }
      />
    </>
  );
};

export default PriceActions;