import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
    tableNumber,
    ownerId,
  } = useCart();
  const [customerNote, setCustomerNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const placeOrder = async () => {
    if (!items.length) return;

    try {
      setLoading(true);
      setError('');
      await api.post('/orders', {
        tableNumber: Number(tableNumber),
        ownerId,
        items: items.map((item) => ({ menuItem: item._id, quantity: item.quantity })),
        customerNote,
      });
      clearCart();
      closeCart();
      navigate(`/order-success?table=${tableNumber}&owner=${ownerId}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not place order right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isCartOpen && <button type="button" className="fixed inset-0 z-30 bg-stone-950/40" onClick={closeCart} />}
      <aside className={`fixed bottom-0 right-0 top-0 z-40 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand">Table {tableNumber || '--'}</p>
            <h3 className="font-display text-2xl text-stone-900">Your Cart</h3>
          </div>
          <button type="button" onClick={closeCart} className="rounded-full bg-stone-100 px-3 py-2 text-sm font-semibold text-stone-600">Close</button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {!items.length && <p className="rounded-3xl bg-brand-soft p-4 text-sm text-stone-600">Your cart is empty. Add a few dishes and we will send them straight to the kitchen.</p>}
          {items.map((item) => (
            <div key={item._id} className="rounded-3xl border border-stone-100 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-stone-900">{item.name}</h4>
                  <p className="text-sm text-stone-500">UGX {item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-stone-100 px-2 py-1">
                  <button type="button" onClick={() => updateQuantity(item._id, item.quantity - 1)} className="h-8 w-8 rounded-full bg-white text-brand">-</button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item._id, item.quantity + 1)} className="h-8 w-8 rounded-full bg-brand text-white">+</button>
                </div>
              </div>
            </div>
          ))}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-stone-700">Customer note</span>
            <textarea
              rows="4"
              value={customerNote}
              onChange={(event) => setCustomerNote(event.target.value)}
              placeholder="Any allergies, spice preferences, or serving notes?"
              className="w-full rounded-3xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-brand"
            />
          </label>

          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
        </div>

        <div className="border-t border-stone-200 px-5 py-5">
          <div className="mb-4 flex items-center justify-between text-sm text-stone-600">
            <span>{totalItems} item(s)</span>
            <span className="font-semibold text-stone-900">UGX {totalPrice.toLocaleString()}</span>
          </div>
          <button type="button" disabled={!items.length || loading} onClick={placeOrder} className="w-full rounded-2xl bg-brand px-4 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-stone-300">
            {loading ? 'Placing order...' : 'Place Order'}
          </button>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
