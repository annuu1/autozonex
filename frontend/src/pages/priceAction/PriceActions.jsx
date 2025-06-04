import React, { useState, useEffect } from 'react';
import ModalDialog from "../../components/common/ModalDialog";
import AddPriceActionForm from "../../components/dialogs/AddPriceActionForm";
import { createPriceAction, deletePriceAction, getAllPriceActions, updatePriceAction, updateLastSeen} from "../../api/priceAction";
import ListItemLayout from "../../components/layouts/ItemDetailsLayout";
import { IconButton, Tooltip } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import UndoIcon from '@mui/icons-material/Undo';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Pulse animation for the EventIcon button
const pulseKeyframes = `
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 #16a34a55; }
  70% { box-shadow: 0 0 0 10px rgba(22,163,74,0); }
  100% { box-shadow: 0 0 0 0 rgba(22,163,74,0); }
}`;
if (typeof window !== 'undefined' && !document.getElementById('pulse-keyframes')) {
  const style = document.createElement('style');
  style.id = 'pulse-keyframes';
  style.innerHTML = pulseKeyframes;
  document.head.appendChild(style);
}

function isLastSeenToday(lastSeen) {
  if (!lastSeen) return false;
  const today = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
  const seen = new Date(lastSeen).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
  return today === seen;
}


const PriceActions = () => {
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [prevLastSeen, setPrevLastSeen] = useState(null);

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

  const handleLastSeenUpdate = async (itemId, revert = false) => {
    const item = items.find((i) => i._id === itemId);
    if (!item) return;

    setPrevLastSeen(item.last_seen);
    await updateLastSeen(itemId);
  };


  const renderDetails = (item) => (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {(typeof item.symbol === 'object' ? item.symbol?.symbol : item.symbol) || 'N/A'} Details
      </h2>
      <div className="flex space-x-2 mb-4">
      <div className="flex items-center text-gray-600 mb-2">
      <span>Last Seen: {item.last_seen ? new Date(item.last_seen).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A'}</span>
      <Tooltip title="Mark Seen Today">
        <IconButton
          onClick={() => handleLastSeenUpdate(item._id, false)}
          sx={{
            color: '#16a34a',
            ml: 1,
            p: 0.5,
            animation: !isLastSeenToday(item.last_seen) ? 'pulse 1.2s infinite' : 'none',
            transition: 'box-shadow 0.2s',
          }}
        >
          <EventIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Revert to Previous">
        <span>
          <IconButton
            onClick={() => handleLastSeenUpdate(item._id, true)}
            sx={{ 
              color: '#f59e0b',
              ml: 0.5,
              p: 0.5,
              '&.Mui-disabled': { color: '#a1a1aa' }
            }}
            disabled={!prevLastSeen}
          >
            <UndoIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </div>
      </div>
      <p className="text-gray-600 mb-2">
        Follows Demand Supply: {item.follows_demand_supply
          ? <CheckCircleIcon sx={{ color: '#16a34a', verticalAlign: 'middle' }} />
          : <CancelIcon sx={{ color: '#ef4444', verticalAlign: 'middle' }} />
        }
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