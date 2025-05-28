import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import TradeJournalForm from "../../components/dialogs/TradeJournalForm";
import {formatDate} from "../../utils/formatDate"
import ListItemLayout from "../../components/layouts/ItemDetailsLayout";

// --- API Consumer Functions ---
const API_URL = import.meta.env.VITE_API_URL || "";

const getToken = () => localStorage.getItem("token");

const fetchTradeJournals = async () => {
  const token = getToken();
  const res = await fetch(`${API_URL}/trade-journal`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch journals");
  return res.json();
};

const addTradeJournal = async (data) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/trade-journal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add journal");
  return res.json();
};

const updateTradeJournal = async (id, data) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/trade-journal/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update journal");
  return res.json();
};

const deleteTradeJournal = async (id) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/trade-journal/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete journal");
  return res.json();
};

// --- Main TradeJournal Page ---
const TradeJournal = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [journals, setJournals] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);

  // Fetch all trade journals
  const loadJournals = async () => {
    setLoading(true);
    try {
      const data = await fetchTradeJournals();
      setJournals(data);
    } catch (err) {
      console.error("Error fetching journals:", err);
      setJournals([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadJournals();
    }
    // eslint-disable-next-line
  }, [authLoading, user]);

  // Add or update trade
  const handleFormSubmit = async (form) => {
    try {
      if (editData && editData._id) {
        await updateTradeJournal(editData._id, form);
      } else {
        await addTradeJournal(form);
      }
      setEditData(null);
      loadJournals();
    } catch (err) {
      alert("Error saving trade entry.");
    }
  };

  // Open add form on details side
  const handleAdd = () => {
    setEditData({});
    setSelectedJournal(null);
  };

  // Open edit form on details side
  const handleEdit = (journal) => {
    setEditData(journal);
    setSelectedJournal(journal);
  };

  // Render details or form for selected journal
  const renderDetails = (journal) => {
    if (editData && (editData._id || Object.keys(editData).length > 0)) {
      return (
        <TradeJournalForm
          open={true}
          onClose={() => setEditData(null)}
          onSuccess={handleFormSubmit}
          editId={editData._id || null}
          initialData={editData}
        />
      );
    }
    if (!journal) {
      return <div className="text-gray-500 text-lg">Select a trade entry to view its details.</div>;
    }
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-bold text-gray-800">{journal.symbol?.toUpperCase() || 'N/A'} Trade</h3>
          <div className="space-x-2">
            <button
              onClick={() => handleEdit(journal)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(journal._id)}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><span className="font-semibold">Date: </span>{journal.tradeDate ? formatDate(journal.tradeDate) : '—'}</div>
          <div><span className="font-semibold">Trade Type: </span>{journal.tradeType || '—'}</div>
          <div><span className="font-semibold">Entry Price: </span>{journal.entryPrice}</div>
          <div><span className="font-semibold">Quantity: </span>{journal.quantity}</div>
          <div><span className="font-semibold">Position Size: </span>{journal.positionSize}</div>
          <div><span className="font-semibold">Stop Loss: </span>{journal.stopLoss}</div>
          <div><span className="font-semibold">Fees: </span>{journal.fees || '—'}</div>
          <div><span className="font-semibold">Status: </span>{journal.status}</div>
          <div><span className="font-semibold">Broker: </span>{journal.broker || '—'}</div>
          <div><span className="font-semibold">Market: </span>{journal.market || '—'}</div>
          <div><span className="font-semibold">Risk/Reward: </span>{journal.riskRewardRatio || '—'}</div>
          <div><span className="font-semibold">Strategy: </span>{journal.strategy || '—'}</div>
          <div className="col-span-2"><span className="font-semibold">Tags: </span>{journal.tags && journal.tags.length ? journal.tags.join(', ') : '—'}</div>
        </div>
        <div>
          <span className="font-semibold">Notes: </span>{journal.journalNotes || '—'}
        </div>
        <div>
          <span className="font-semibold">Emotion Before: </span>{journal.emotionBefore || '—'}
        </div>
        <div>
          <span className="font-semibold">Emotion After: </span>{journal.emotionAfter || '—'}
        </div>
        <div>
          <span className="font-semibold">Holding Period: </span>{journal.holdingPeriod || '—'}
        </div>
        {journal.setupScreenshotUrl && (
          <div>
            <span className="font-semibold">Screenshot: </span>
            <a href={journal.setupScreenshotUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Screenshot</a>
          </div>
        )}
        <div className="text-xs text-gray-400 mt-6">Created: {journal.createdAt ? formatDate(journal.createdAt) : '—'} | Updated: {journal.updatedAt ? formatDate(journal.updatedAt) : '—'}</div>
      </div>
    );
  };

  // Delete trade
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteTradeJournal(id);
      loadJournals();
    } catch (err) {
      alert("Error deleting trade entry.");
    }
  };

  if (authLoading || loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="w-full h-screen">
      <div className="flex items-center justify-between p-6 pb-0">
        <h2 className="text-2xl font-semibold text-gray-800">Trade Journal</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Trade Entry
        </button>
      </div>
      <ListItemLayout
        items={journals}
        selectedItem={selectedJournal}
        onSelect={item => {
          setSelectedJournal(item);
          setEditData(null);
        }}
        renderDetails={renderDetails}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TradeJournal;