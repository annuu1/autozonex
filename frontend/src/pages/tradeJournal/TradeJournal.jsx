import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import TradeJournalForm from "../../components/dialogs/TradeJournalForm";
import { formatDate } from "../../utils/formatDate";
import ListItemLayout from "./ItemDetailsLayout";

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
  const [statusFilter, setStatusFilter] = useState("Open");

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
      setSelectedJournal(null);
      loadJournals();
    } catch (err) {
      alert("Error saving trade entry.");
    }
  };

  // Open add form
  const handleAdd = () => {
    setEditData({});
    setSelectedJournal(null);
  };

  // Open edit form
  const handleEdit = (journal) => {
    setEditData(journal);
    setSelectedJournal(journal);
  };

  // Cancel form
  const handleCancel = () => {
    setEditData(null);
  };

  // Delete trade
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteTradeJournal(id);
      setSelectedJournal(null);
      setEditData(null);
      loadJournals();
    } catch (err) {
      alert("Error deleting trade entry.");
    }
  };

  // Render details or form for selected journal
  const renderDetails = (journal) => {
    if (editData !== null) {
      return (
        <TradeJournalForm
          editId={editData._id || null}
          onSuccess={handleFormSubmit}
        />
      );
    }
    if (!journal) {
      return (
        <div className="text-gray-500 text-lg p-6">
          Select a trade entry to view its details or click "Add Trade Entry" to create a new one.
        </div>
      );
    }
    return (
      <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            {journal.symbol?.toUpperCase() || "N/A"} Trade
          </h3>
          <div className="space-x-2">
            <button
              onClick={() => handleEdit(journal)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(journal._id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Trade Info Section */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Trade Info</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="font-medium text-gray-600">Date:</span>{" "}
              {journal.tradeDate ? formatDate(journal.tradeDate) : "—"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Trade Type:</span>{" "}
              {journal.tradeType || "—"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Status:</span>{" "}
              <span
                className={`inline-block px-2 py-1 text-sm rounded-full ${journal.status === "Closed"
                    ? "bg-green-100 text-green-800"
                    : journal.status === "Open"
                      ? "bg-blue-100 text-blue-800"
                      : journal.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
              >
                {journal.status || "—"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Result:</span>{" "}
              {journal.result ? (
                <span
                  className={`inline-block px-2 py-1 text-sm rounded-full ${journal.result === "win"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                    }`}
                >
                  {journal.result.charAt(0).toUpperCase() + journal.result.slice(1)}
                </span>
              ) : (
                "—"
              )}
            </div>
            <div>
              <span className="font-medium text-gray-600">Strategy:</span>{" "}
              {journal.strategy || "—"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Mode:</span>{" "}
              {journal.mode || "—"}
            </div>
          </div>
        </div>

        {/* Financials Section */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Financials</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="font-medium text-gray-600">Entry Price:</span>{" "}
              {journal.entryPrice != null ? `₹${journal.entryPrice}` : "—"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Exit Price:</span>{" "}
              {journal.exitPrice != null ? `₹${journal.exitPrice}` : "—"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Quantity:</span>{" "}
              {journal.quantity != null ? journal.quantity : "—"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Position Size:</span>{" "}
              {journal.positionSize != null ? `₹${journal.positionSize}` : "—"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Stop Loss:</span>{" "}
              {journal.stopLoss != null ? `₹${journal.stopLoss}` : "—"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Take Profit:</span>{" "}
              {journal.takeProfit != null ? `₹${journal.takeProfit}` : "—"}
            </div>
            <div>
              <span className="font-medium text-gray-600">PnL:</span>{" "}
              {journal.pnl != null ? (
                <span
                  className={journal.pnl >= 0 ? "text-green-600" : "text-red-600"}
                >
                  ₹{journal.pnl}
                </span>
              ) : (
                "—"
              )}
            </div>
            <div>
              <span className="font-medium text-gray-600">Fees:</span>{" "}
              {journal.fees != null ? `₹${journal.fees}` : "—"}
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">
            Additional Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="font-medium text-gray-600">Broker:</span>{" "}
              {journal.broker || "—"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Market:</span>{" "}
              {journal.market || "—"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Risk/Reward:</span>{" "}
              {journal.riskRewardRatio || "—"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Rate Trade:</span>{" "}
              {journal.rateTrade != null ? `${journal.rateTrade}/10` : "—"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Holding Period:</span>{" "}
              {journal.holdingPeriod || "—"}
            </div>
            <div className="col-span-2">
              <span className="font-medium text-gray-600">Tags:</span>{" "}
              {journal.tags && journal.tags.length ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {journal.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                "—"
              )}
            </div>
            {journal.setupScreenshotUrl && (
              <div className="col-span-2">
                <span className="font-medium text-gray-600">Screenshot:</span>{" "}
                <a
                  href={journal.setupScreenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Screenshot
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Notes</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-4">
              <span className="font-medium text-gray-600">Journal Notes:</span>{" "}
              {journal.journalNotes || "—"}
            </div>
            <div className="mb-4">
              <span className="font-medium text-gray-600">Emotion Before:</span>{" "}
              {journal.emotionBefore || "—"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Emotion After:</span>{" "}
              {journal.emotionAfter || "—"}
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-6">
          Created: {journal.createdAt ? formatDate(journal.createdAt) : "—"} | Updated:{" "}
          {journal.updatedAt ? formatDate(journal.updatedAt) : "—"}
        </div>
      </div>
    );
  };

  if (authLoading || loading) {
    return <div className="text-center text-gray-600 p-6">Loading...</div>;
  }

  // Filter journals by status
  const filteredJournals = journals.filter((j) =>
    statusFilter === "All" ? true : j.status === statusFilter
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="flex items-center justify-between p-6 bg-white shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800">Trade Journal</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Trade Entry
        </button>
      </div>
      <ListItemLayout
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        items={filteredJournals}
        selectedItem={selectedJournal}
        onSelect={(item) => {
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