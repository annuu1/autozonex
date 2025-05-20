import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import TradeJournalForm from "../../components/dialogs/TradeJournalForm";

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
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
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
  const handleDialogSubmit = async (form) => {
    try {
      if (editData && editData._id) {
        await updateTradeJournal(editData._id, form);
      } else {
        await addTradeJournal(form);
      }
      setDialogOpen(false);
      setEditData(null);
      loadJournals();
    } catch (err) {
      alert("Error saving trade entry.");
    }
  };

  // Open dialog for add
  const handleAdd = () => {
    setEditData(null);
    setDialogOpen(true);
  };

  // Open dialog for edit
  const handleEdit = (journal) => {
    setEditData(journal);
    setDialogOpen(true);
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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Trade Journal</h2>
      <button
        onClick={handleAdd}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Trade Entry
      </button>

      <TradeJournalForm
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditData(null);
        }}
        onSuccess={handleDialogSubmit}
        editId={editData?._id || null}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Symbol</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Side</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">PnL</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fees</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Notes</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {journals.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-600">
                  No trade entries found.
                </td>
              </tr>
            ) : (
              journals.map((j) => (
                <tr key={j._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{j.date ? j.date.slice(0, 10) : ""}</td>
                  <td className="px-4 py-2">{j.symbol}</td>
                  <td className="px-4 py-2">{j.side}</td>
                  <td className="px-4 py-2">{j.quantity}</td>
                  <td className="px-4 py-2">{j.price}</td>
                  <td className="px-4 py-2">{j.pnl}</td>
                  <td className="px-4 py-2">{j.fees}</td>
                  <td className="px-4 py-2">{j.notes}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(j)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(j._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeJournal;