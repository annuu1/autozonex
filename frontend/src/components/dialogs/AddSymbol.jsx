import { createSymbol } from '../../api/symbols';
import { useState } from 'react';

const AddSymbol = ({ onClose }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    exchange: '',
    sector: '',
    industry: '',
    active: true
  });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSymbol(formData);
      onClose();
    } catch (error) {
      console.error('Error creating symbol:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Symbol</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium mb-1">Symbol</label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleFormChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Exchange</label>
          <input
            type="text"
            name="exchange"
            value={formData.exchange}
            onChange={handleFormChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Sector</label>
          <input
            type="text"
            name="sector"
            value={formData.sector}
            onChange={handleFormChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Industry</label>
          <input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleFormChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleFormChange}
            className="w-4 h-4"
          />
          <label className="font-medium">Active</label>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Symbol
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddSymbol;
