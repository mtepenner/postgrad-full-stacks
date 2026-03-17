import { useState } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [newGenre, setNewGenre] = useState('');
  const [adminCodeStatus, setAdminCodeStatus] = useState('');

  const handleCreateGenre = async (e) => {
    e.preventDefault();
    try {
      await api.post('/genres', { name: newGenre });
      alert("Genre created successfully!");
      setNewGenre('');
    } catch (error) {
      alert("Failed to create genre.");
    }
  };

  const handleGenerateAdminCode = async () => {
    try {
      // Backend route that creates a new code in the Admin_ID table
      const res = await api.post('/admin-codes/generate'); 
      setAdminCodeStatus(`New Code Generated: ${res.data.code}`);
    } catch (error) {
      setAdminCodeStatus("Failed to generate code.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg border-t-4 border-red-600">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Control Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Genre Management */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Add New Genre</h2>
          <form onSubmit={handleCreateGenre} className="flex gap-2">
            <input 
              type="text" 
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              placeholder="e.g., Sci-Fi" 
              className="flex-1 p-2 border border-gray-300 rounded"
              required
            />
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold">
              Add
            </button>
          </form>
        </div>

        {/* System Administration */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">System Access</h2>
          <p className="text-sm text-gray-600 mb-4">Generate a one-time code to allow a new user to register as an Administrator.</p>
          <button 
            onClick={handleGenerateAdminCode}
            className="w-full bg-gray-800 hover:bg-black text-white px-4 py-3 rounded font-bold transition-colors"
          >
            Generate New Admin ID
          </button>
          {adminCodeStatus && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded font-mono text-center">
              {adminCodeStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
