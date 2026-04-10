import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';
import { useToast } from '../../components/ToastContainer';

/**
 * MenuManagementPage Component
 * Card grid layout for menu items management
 * Features: Add/edit/delete items, toggle availability, image upload
 */

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
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

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
    setImagePreview(item.image || null);
    setShowModal(true);
  };

  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    setImagePreview(null);
    setEditingId('');
    setShowModal(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
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
        await api.put(`/menu/items/${editingId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('✓ Menu item updated successfully!');
      } else {
        await api.post('/menu/items', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('✓ New menu item added!');
      }

      resetForm();
      await fetchData();
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Could not save menu item.';
      setError(message);
      toast.error('✕ ' + message);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await api.delete(`/menu/items/${id}`);
      toast.success('✓ Menu item deleted');
      await fetchData();
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Could not delete menu item.';
      setError(message);
      toast.error('✕ ' + message);
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await api.patch(`/menu/items/${id}/toggle`);
      toast.success('✓ Availability updated');
      await fetchData();
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Could not update availability.';
      setError(message);
      toast.error('✕ ' + message);
    }
  };

  return (
    <AdminLayout
      title="Menu Items"
      subtitle="Create dishes that look good before they even hit the table"
    >
      {error && (
        <div
          className="rounded-lg px-6 py-4 text-sm mb-6"
          style={{
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
          }}
        >
          {error}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h2 style={{ color: 'var(--color-espresso)', fontSize: '18px', fontWeight: '600' }}>
          Total Items: <span style={{ color: 'var(--color-primary)' }}>{items.length}</span>
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          ➕ Add Item
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-2xl rounded-xl p-6 shadow-lg my-8"
            style={{
              backgroundColor: 'var(--color-cream-light)',
              animation: 'popIn 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="font-display text-2xl font-bold mb-6"
              style={{ color: 'var(--color-espresso)' }}
            >
              {editingId ? '✏️ Edit Item' : '➕ Add New Item'}
            </h3>

            <form onSubmit={submitForm} className="space-y-4">
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Dish Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 rounded-lg border-b-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'transparent',
                    borderBottomColor: 'var(--color-accent)',
                    backgroundColor: 'var(--color-white)',
                  }}
                />
              </div>

              {/* Name & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--color-charcoal)' }}
                  >
                    Dish Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((current) => ({ ...current, name: e.target.value }))
                    }
                    placeholder="e.g., Grilled Salmon"
                    required
                    className="w-full px-4 py-2 rounded-lg border-b-2 focus:outline-none transition-all"
                    style={{
                      borderColor: 'transparent',
                      borderBottomColor: 'var(--color-accent)',
                      backgroundColor: 'var(--color-white)',
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--color-charcoal)' }}
                  >
                    Price (UGX)
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((current) => ({ ...current, price: e.target.value }))
                    }
                    placeholder="0"
                    required
                    className="w-full px-4 py-2 rounded-lg border-b-2 focus:outline-none transition-all"
                    style={{
                      borderColor: 'transparent',
                      borderBottomColor: 'var(--color-accent)',
                      backgroundColor: 'var(--color-white)',
                    }}
                  />
                </div>
              </div>

              {/* Category & Prep Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--color-charcoal)' }}
                  >
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((current) => ({ ...current, category: e.target.value }))
                    }
                    required
                    className="w-full px-4 py-2 rounded-lg border-b-2 focus:outline-none transition-all"
                    style={{
                      borderColor: 'transparent',
                      borderBottomColor: 'var(--color-accent)',
                      backgroundColor: 'var(--color-white)',
                    }}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--color-charcoal)' }}
                  >
                    Prep Time (min)
                  </label>
                  <input
                    type="number"
                    value={form.preparationTime}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        preparationTime: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 rounded-lg border-b-2 focus:outline-none transition-all"
                    style={{
                      borderColor: 'transparent',
                      borderBottomColor: 'var(--color-accent)',
                      backgroundColor: 'var(--color-white)',
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, description: e.target.value }))
                  }
                  placeholder="Tell us about this beautiful dish..."
                  rows="3"
                  required
                  className="w-full px-4 py-2 rounded-lg border-b-2 focus:outline-none transition-all resize-none"
                  style={{
                    borderColor: 'transparent',
                    borderBottomColor: 'var(--color-accent)',
                    backgroundColor: 'var(--color-white)',
                  }}
                />
              </div>

              {/* Allergens */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Allergens (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.allergens}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, allergens: e.target.value }))
                  }
                  placeholder="e.g., Dairy, Gluten, Nuts"
                  className="w-full px-4 py-2 rounded-lg border-b-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'transparent',
                    borderBottomColor: 'var(--color-accent)',
                    backgroundColor: 'var(--color-white)',
                  }}
                />
              </div>

              {/* Popular Checkbox */}
              <label
                className="flex items-center gap-3 px-4 py-3 rounded-lg"
                style={{ backgroundColor: 'var(--color-white)' }}
              >
                <input
                  type="checkbox"
                  checked={form.isPopular}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, isPopular: e.target.checked }))
                  }
                  className="w-4 h-4 cursor-pointer"
                />
                <span
                  className="text-sm font-semibold cursor-pointer"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Mark as Popular ⭐
                </span>
              </label>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg font-semibold text-white transition-all"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? '⏳ Saving...' : editingId ? '✓ Update Item' : '✓ Add Item'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2 rounded-lg font-semibold transition-all"
                  style={{
                    backgroundColor: 'var(--color-cream-dark)',
                    color: 'var(--color-espresso)',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items Grid */}
      {items.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: 'var(--color-cream-dark)' }}
        >
          <p
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--color-espresso)' }}
          >
            No menu items yet
          </p>
          <p style={{ color: 'var(--color-muted)', marginBottom: '20px' }}>
            Start by adding your first dish
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 rounded-lg font-semibold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            ➕ Add First Item
          </button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="rounded-xl p-4 overflow-hidden transition-all hover:shadow-lg"
              style={{
                backgroundColor: 'var(--color-cream-light)',
                borderTop: `3px solid ${item.isAvailable ? 'var(--color-accent)' : '#999'}`,
                animation: 'fadeUp 0.4s ease-out',
              }}
            >
              {/* Image */}
              <div className="mb-4 rounded-lg overflow-hidden h-40 bg-gray-200">
                <img
                  src={
                    item.image ||
                    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=320&q=80'
                  }
                  alt={item.name}
                  className={`w-full h-full object-cover transition-transform ${
                    !item.isAvailable ? 'opacity-50' : ''
                  }`}
                />
              </div>

              {/* Content */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className="font-display text-lg font-bold flex-1"
                    style={{ color: 'var(--color-espresso)' }}
                  >
                    {item.name}
                  </h3>
                  {item.isPopular && <span className="text-xl ml-2">⭐</span>}
                </div>

                <p
                  className="text-xs mb-3"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {item.description}
                </p>

                {/* Category & Prep Time */}
                <div className="flex gap-3 text-xs mb-2">
                  {item.category && (
                    <span
                      className="px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: 'var(--color-accent)',
                        color: 'var(--color-white)',
                      }}
                    >
                      {item.category?.name}
                    </span>
                  )}
                  {item.preparationTime && (
                    <span
                      className="px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-white)',
                      }}
                    >
                      ⏱️ {item.preparationTime}min
                    </span>
                  )}
                </div>

                {/* Allergens */}
                {item.allergens && item.allergens.length > 0 && (
                  <p
                    className="text-xs mb-3"
                    style={{ color: '#DC2626' }}
                  >
                    ⚠️ {item.allergens.join(', ')}
                  </p>
                )}

                {/* Price */}
                <p
                  className="text-lg font-semibold"
                  style={{ color: 'var(--color-primary)' }}
                >
                  UGX {Number(item.price).toLocaleString('en-UG')}
                </p>
              </div>

              {/* Availability Badge */}
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => toggleAvailability(item._id)}
                  className="flex-1 px-2 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: item.isAvailable
                      ? '#DCFCE7'
                      : '#FEE2E2',
                    color: item.isAvailable ? '#166534' : '#991B1B',
                  }}
                >
                  {item.isAvailable ? '✓ Available' : '✕ Hidden'}
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openForEdit(item)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-white)',
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteItem(item._id)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: '#FEE2E2',
                    color: '#991B1B',
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default MenuManagementPage;
