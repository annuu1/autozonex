import React from "react";

const ListItemLayout = ({ items, selectedItem, onSelect, renderDetails, onDelete }) => {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Left List Section */}
      <div className="w-1/3 border-r border-gray-300 overflow-y-auto p-4 bg-white">
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item._id}
              className={`p-3 rounded-lg cursor-pointer flex items-center justify-between transition ${selectedItem?._id === item._id
                  ? "bg-blue-100 font-semibold"
                  : "hover:bg-gray-100"
                }`}
              onClick={() => onSelect(item)}
            >
              <span className="font-semibold">
                {typeof item.symbol === 'object'
                  ? item.symbol?.symbol || 'N/A'
                  : item.symbol || 'N/A'}
              </span>
              <span className="ml-2 text-xs text-gray-500">{item.tradeDate ? new Date(item.tradeDate).toLocaleDateString() : ''}</span>
              <span className="ml-2 text-xs text-gray-600">{item.tradeType || ''}</span>
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700 p-1 rounded"
                title="Delete"
                onClick={e => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this Price Action?')) {
                    onDelete && onDelete(item._id);
                  }
                }}
              >
                {/* Trash SVG icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Detail Section */}
      <div className="w-2/3 overflow-y-auto p-6">
        {renderDetails(selectedItem)}
      </div>
    </div>
  );
};

export default ListItemLayout;
