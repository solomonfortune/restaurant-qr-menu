import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import QRCodeCard from '../../components/QRCodeCard';
import api from '../../api/axios';

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ tableNumber: '', label: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    try {
      const { data } = await api.get('/tables');
      setTables(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load tables.');
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const createTable = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await api.post('/tables', form);
      setForm({ tableNumber: '', label: '' });
      fetchTables();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not create table.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTable = async (id) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      await api.delete(`/tables/${id}`);
      fetchTables();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete table.');
    }
  };

  return (
    <AdminLayout title="Tables & QR Codes" subtitle="Print, place, and manage table QR codes">
      <form onSubmit={createTable} className="mb-6 grid gap-4 rounded-[28px] bg-white p-6 shadow-sm md:grid-cols-[1fr_1fr_auto]">
        <input type="number" value={form.tableNumber} onChange={(event) => setForm((current) => ({ ...current, tableNumber: event.target.value }))} placeholder="Table number" required className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-brand" />
        <input value={form.label} onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))} placeholder="Optional label e.g. Window Table" className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-brand" />
        <button type="submit" disabled={loading} className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white">{loading ? 'Adding...' : 'Add Table'}</button>
      </form>

      {error && <p className="mb-6 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-600">{error}</p>}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tables.map((table) => <QRCodeCard key={table._id} table={table} onDelete={deleteTable} />)}
      </div>
    </AdminLayout>
  );
};

export default TablesPage;
