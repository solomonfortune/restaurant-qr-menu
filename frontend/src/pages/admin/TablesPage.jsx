import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import QRCodeCard from '../../components/QRCodeCard';
import LoadingSpinner from '../../components/LoadingSpinner';

function TablesPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ tableNumber: '', label: '' });

  const fetchTables = async () => {
    try {
      const response = await api.get('/tables');
      setTables(response.data.tables);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tables', {
        tableNumber: formData.tableNumber,
        label: formData.label
      });
      fetchTables();
      setShowModal(false);
      setFormData({ tableNumber: '', label: '' });
    } catch (error) {
      console.error('Failed to create table:', error);
      alert(error.response?.data?.message || 'Failed to create table');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Navbar>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tables & QR Codes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium"
        >
          Add Table
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {tables.map(table => (
          <QRCodeCard key={table._id} table={table} onDelete={fetchTables} />
        ))}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-4">No tables yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium"
          >
            Add Your First Table
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Table</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Table Number</label>
                <input
                  type="number"
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  required
                  min="1"
                  className="w-full border rounded-lg p-2"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Label (optional)</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full border rounded-lg p-2"
                  placeholder="e.g. Window Table"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Navbar>
  );
}

export default TablesPage;