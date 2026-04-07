import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  preparationTime: 15,
  allergens: '',
  isPopular: false,
};

const MenuManagementPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [itemResponse, categoryResponse] = await Promise.all([
        api.get('/menu/items'),
        api.get('/menu/categories'),
      ]);
      setItems(itemResponse.data);
      setCategories(categoryResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load menu items.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openForEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category?._id || '',
      preparationTime: item.preparationTime || 15,
      allergens: item.allergens?.join(', ') || '',
      isPopular: Boolean(item.isPopular),
    });
    setImageFile(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    setEditingId('');
    setShowForm(false);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      if (imageFile) payload.append('image', imageFile);

      if (editingId) {
        await api.put(`/menu/items/${editingId}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/menu/items', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      resetForm();
      fetchData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save menu item.');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await api.delete(`/menu/items/${id}`);
      fetchData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete menu item.');
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await api.patch(`/menu/items/${id}/toggle`);
      fetchData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update availability.');
    }
  };

  return (
    <AdminLayout title="Menu Items" subtitle="Create dishes that look good before they even hit the table">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl text-stone-900">Your Menu</h3>
          <p className="text-sm text-stone-500">Add, edit, and control item availability in real time.</p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white">Add New Item</button>
      </div>

      {error && <p className="mb-6 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-600">{error}</p>}

      {showForm && (
        <form onSubmit={submitForm} className="mb-6 rounded-[28px] bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Dish name" required className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-brand" />
            <input type="number" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} placeholder="Price in UGX" required className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-brand" />
            <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} required className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-brand">
              <option value="">Select a category</option>
              {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
            </select>
            <input type="number" value={form.preparationTime} onChange={(event) => setForm((current) => ({ ...current, preparationTime: event.target.value }))} placeholder="Preparation time" className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-brand" />
            <input value={form.allergens} onChange={(event) => setForm((current) => ({ ...current, allergens: event.target.value }))} placeholder="Allergens e.g. Dairy, Gluten" className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-brand md:col-span-2" />
            <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows="4" placeholder="Dish description" required className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-brand md:col-span-2" />
            <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-brand" />
            <label className="flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-700">
              <input type="checkbox" checked={form.isPopular} onChange={(event) => setForm((current) => ({ ...current, isPopular: event.target.checked }))} />
              Mark as popular
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button type="submit" disabled={loading} className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white">{loading ? 'Saving...' : editingId ? 'Update Item' : 'Create Item'}</button>
            <button type="button" onClick={resetForm} className="rounded-2xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-600">Cancel</button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th className="px-5 py-4">Item</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Available</th>
                <th className="px-5 py-4">Popular</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-t border-stone-100">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=320&q=80'} alt={item.name} className="h-14 w-14 rounded-2xl object-cover" />
                      <div>
                        <p className="font-semibold text-stone-900">{item.name}</p>
                        <p className="text-xs text-stone-500">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">{item.category?.name}</td>
                  <td className="px-5 py-4">UGX {item.price.toLocaleString()}</td>
                  <td className="px-5 py-4"><button type="button" onClick={() => toggleAvailability(item._id)} className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.isAvailable ? 'Available' : 'Hidden'}</button></td>
                  <td className="px-5 py-4">{item.isPopular ? <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">Popular</span> : '-'}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openForEdit(item)} className="rounded-2xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700">Edit</button>
                      <button type="button" onClick={() => deleteItem(item._id)} className="rounded-2xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MenuManagementPage;
