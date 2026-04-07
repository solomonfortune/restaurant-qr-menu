import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [categoryResponse, menuResponse] = await Promise.all([
        api.get('/menu/categories'),
        api.get('/menu/items'),
      ]);
      setCategories(categoryResponse.data);
      setMenuItems(menuResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load categories.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const itemCounts = useMemo(() => menuItems.reduce((accumulator, item) => {
    const key = item.category?._id;
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {}), [menuItems]);

  const submitForm = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingId) {
        await api.put(`/menu/categories/${editingId}`, form);
      } else {
        await api.post('/menu/categories', form);
      }
      setForm({ name: '', description: '' });
      setEditingId('');
      fetchData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save category.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setForm({ name: category.name, description: category.description || '' });
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/menu/categories/${id}`);
      fetchData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete category.');
    }
  };

  return (
    <AdminLayout title="Categories" subtitle="Shape the menu your guests browse">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={submitForm} className="rounded-[28px] bg-white p-6 shadow-sm">
          <h3 className="font-display text-2xl text-stone-900">{editingId ? 'Edit Category' : 'Add Category'}</h3>
          <div className="mt-5 space-y-4">
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Category name" required className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-brand" />
            <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows="4" placeholder="Short description" className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-brand" />
            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="flex-1 rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white">{loading ? 'Saving...' : editingId ? 'Update Category' : 'Add Category'}</button>
              {editingId && <button type="button" onClick={() => { setEditingId(''); setForm({ name: '', description: '' }); }} className="rounded-2xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-600">Cancel</button>}
            </div>
          </div>
        </form>

        <section className="rounded-[28px] bg-white p-6 shadow-sm">
          <h3 className="font-display text-2xl text-stone-900">Current Categories</h3>
          <div className="mt-5 space-y-4">
            {categories.map((category) => (
              <div key={category._id} className="flex flex-col gap-3 rounded-3xl border border-stone-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-stone-900">{category.name}</p>
                  <p className="text-sm text-stone-500">{category.description || 'No description yet'}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-400">{itemCounts[category._id] || 0} item(s)</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => startEdit(category)} className="rounded-2xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700">Edit</button>
                  <button type="button" onClick={() => deleteCategory(category._id)} className="rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default CategoryPage;
