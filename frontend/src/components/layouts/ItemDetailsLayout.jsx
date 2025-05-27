import React from "react";

const ListItemLayout = ({ items, selectedItem, onSelect, renderDetails }) => {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Left List Section */}
      <div className="w-1/3 border-r border-gray-300 overflow-y-auto p-4 bg-white">
        <h2 className="text-xl font-semibold mb-4">Price Action Logs</h2>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item._id}
              onClick={() => onSelect(item)}
              className={`p-3 rounded-lg cursor-pointer transition ${
                selectedItem?._id === item._id
                  ? "bg-blue-100 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.symbol?.symbol || 'N/A'}
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
