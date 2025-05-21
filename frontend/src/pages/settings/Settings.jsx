import React, { useEffect, useState } from 'react';
import { getSettings, createSettings, updateSettings, deleteSettings } from '../../api/setting';
import SettingsForm from '../../components/dialogs/SettingsForm';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const data = await getSettings(token);
      setSettings(data);
    } catch (err) {
      setSettings(null);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to fetch settings.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleAddClick = () => {
    setFormMode('add');
    setFormOpen(true);
    setSuccess('');
    setError('');
  };

  const handleEditClick = () => {
    setFormMode('edit');
    setFormOpen(true);
    setSuccess('');
    setError('');
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleFormSubmit = async (values) => {
    const token = localStorage.getItem('token');
    setError('');
    setSuccess('');
    try {
      if (formMode === 'add') {
        await createSettings(values, token);
        setSuccess('Settings created successfully.');
      } else {
        await updateSettings(values, token);
        setSuccess('Settings updated successfully.');
      }
      setFormOpen(false);
      fetchSettings();
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to save settings.');
      }
    }
  };

  const handleDelete = async () => {
    setError('');
    setSuccess('');
    try {
      await deleteSettings(token);
      setSettings(null);
      setSuccess('Settings deleted successfully.');
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to delete settings.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {loading ? (
        <div className="flex justify-center my-8">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-700">
              {success}
            </div>
          )}

          {settings ? (
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Risk Per Trade:</p>
                <p className="text-xl font-semibold">{settings.riskPerTrade} -/</p>
              </div>

              <div className="flex space-x-3">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-700">No settings found.</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleAddClick}
              >
                Add Settings
              </button>
            </div>
          )}
        </div>
      )}

      {/* Custom modal */}
      {formOpen && (
        <SettingsForm
          open={formOpen}
          onClose={handleFormClose}
          existingSettings={settings}
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Settings;
