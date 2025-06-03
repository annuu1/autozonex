import React, { useState } from "react";

const ListItemLayout = ({
  items,
  selectedItem,
  onSelect,
  renderDetails,
  onDelete,
  statusFilter,
  setStatusFilter,
}) => {
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" for newest first, "asc" for oldest first

  // Sort items by tradeDate
  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.tradeDate || 0);
    const dateB = new Date(b.tradeDate || 0);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-50">
      {/* Left List Section */}
      <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto bg-white">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 font-medium">
              Showing {sortedItems.length} {statusFilter} trade{sortedItems.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              title={`Sort by date (${sortOrder === "desc" ? "newest first" : "oldest first"})`}
            >
              <span>Sort</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${sortOrder === "desc" ? "" : "rotate-180"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">Filter:</span>
            <button
              className={`px-3 py-1 rounded-md border text-sm ${
                statusFilter === "Open"
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setStatusFilter("Open")}
            >
              Open
            </button>
            <button
              className={`px-3 py-1 rounded-md border text-sm ${
                statusFilter === "Closed"
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setStatusFilter("Closed")}
            >
              Closed
            </button>
            <button
              className={`px-3 py-1 rounded-md border text-sm ${
                statusFilter === "All"
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setStatusFilter("All")}
            >
              All
            </button>
          </div>
        </div>
        {/* List Items */}
        <ul className="p-4 space-y-3">
          {sortedItems.length === 0 ? (
            <li className="text-center text-gray-500 py-6">
              No trades found. Click "Add Trade Entry" to create one.
            </li>
          ) : (
            sortedItems.map((item) => (
              <li
                key={item._id}
                className={`p-4 rounded-lg cursor-pointer flex flex-col gap-2 bg-white shadow-sm border transition-all ${
                  selectedItem?._id === item._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:shadow-md hover:bg-gray-50"
                }`}
                onClick={() => onSelect(item)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">
                    {typeof item.symbol === "object"
                      ? item.symbol?.symbol?.toUpperCase() || "N/A"
                      : item.symbol?.toUpperCase() || "N/A"}
                  </span>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 p-1 rounded"
                    title="Delete trade"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Are you sure you want to delete this trade?")) {
                        onDelete && onDelete(item._id);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    {item.tradeDate
                      ? new Date(item.tradeDate).toLocaleDateString()
                      : "—"}
                  </span>
                  <span>{item.result || "—"}</span>
                </div>
                <div className="text-xs">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${
                      item.status === "Closed"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Open"
                        ? "bg-blue-100 text-blue-800"
                        : item.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status || "—"}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Right Detail Section */}
      <div className="w-full md:w-2/3 overflow-y-auto p-6">
        {renderDetails(selectedItem)}
      </div>
    </div>
  );
};

export default ListItemLayout;