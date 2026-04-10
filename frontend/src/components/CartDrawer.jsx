import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useToast } from './ToastContainer';
import { formatPrice } from '../utils/formatPrice';

/**
 * CartDrawer Component
 * Slides in from the right with full-screen overlay
 * Displays cart items, summary, and order placement
 */
const CartDrawer = () => {
  const navigate = useNavigate();
  const toast = useToast();
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

      toast.success('🎉 Order placed! Kitchen is preparing your dishes.');
      clearCart();
      closeCart();
      navigate(`/order-success?table=${tableNumber}&owner=${ownerId}`);
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Could not place order right now.';
      setError(message);
      toast.error('✕ ' + message);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 transition-opacity"
          onClick={closeCart}
          style={{ backgroundColor: 'rgba(44, 26, 14, 0.6)' }}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-40 w-full max-w-md flex flex-col transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--color-cream)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b-4"
          style={{
            borderColor: 'var(--color-primary)',
            backgroundColor: 'var(--color-cream)',
          }}
        >
          <div>
            <p
              className="text-xs uppercase tracking-widest font-semibold mb-1"
              style={{ color: 'var(--color-gold)' }}
            >
              📍 Table {tableNumber || '--'}
            </p>
            <h2
              className="font-display text-2xl"
              style={{ color: 'var(--color-espresso)' }}
            >
              Your Order
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="text-3xl leading-none transition hover:opacity-70"
            style={{ color: 'var(--color-muted)' }}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!items.length && (
            <div
              className="rounded-xl p-6 text-center"
              style={{
                backgroundColor: 'var(--color-cream-dark)',
              }}
            >
              <p className="text-lg mb-2">🛒</p>
              <p
                className="text-sm"
                style={{ color: 'var(--color-muted)' }}
              >
                Your cart is empty. Add a few dishes and we'll send them straight to the kitchen.
              </p>
            </div>
          )}

          {items.map((item) => (
            <div
              key={item._id}
              className="rounded-xl p-4 border-2 transition"
              style={{
                backgroundColor: 'var(--color-white)',
                borderColor: 'var(--color-divider)',
              }}
            >
              {/* Item Row 1: Name & Price */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4
                    className="font-semibold"
                    style={{ color: 'var(--color-espresso)' }}
                  >
                    {item.name}
                  </h4>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {formatPrice(item.price)}
                  </p>
                </div>
                <p
                  className="font-display text-lg font-bold"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div
                className="flex items-center gap-2 p-2 rounded-lg"
                style={{
                  backgroundColor: 'var(--color-cream-dark)',
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(item._id, item.quantity - 1)
                  }
                  className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition hover:opacity-70"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-gold)',
                  }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span
                  className="flex-1 text-center text-sm font-semibold"
                  style={{ color: 'var(--color-espresso)' }}
                >
                  {item.quantity} in cart
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(item._id, item.quantity + 1)
                  }
                  className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition hover:opacity-70"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-gold)',
                  }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {/* Customer Note */}
          {items.length > 0 && (
            <div>
              <label
                className="block mb-2 font-semibold"
                style={{ color: 'var(--color-espresso)' }}
              >
                Special Requests
              </label>
              <textarea
                rows="3"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Any allergies, spice preferences, or special requests?"
                className="w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none"
                style={{
                  backgroundColor: 'var(--color-cream-dark)',
                  borderColor: 'var(--color-divider)',
                  color: 'var(--color-espresso)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-gold)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-divider)';
                }}
              />
            </div>
          )}

          {error && (
            <div
              className="rounded-lg px-4 py-3 text-sm"
              style={{
                backgroundColor: '#FEE2E2',
                color: '#991B1B',
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Summary & Order Button */}
        <div
          className="border-t-2 p-6 space-y-4"
          style={{
            borderColor: 'var(--color-divider)',
            backgroundColor: 'var(--color-cream)',
          }}
        >
          {/* Summary Lines */}
          {items.length > 0 && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--color-muted)' }}>
                  {totalItems} item{totalItems !== 1 ? 's' : ''}
                </span>
                <span
                  className="font-semibold"
                  style={{ color: 'var(--color-espresso)' }}
                >
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--color-muted)' }}>
                  Service (included)
                </span>
                <span style={{ color: 'var(--color-muted)' }}>✓</span>
              </div>

              <div
                className="h-px"
                style={{ backgroundColor: 'var(--color-divider)' }}
              />

              <div className="flex items-center justify-between">
                <span
                  className="font-display text-lg font-bold"
                  style={{ color: 'var(--color-espresso)' }}
                >
                  Total
                </span>
                <span
                  className="font-display text-2xl font-bold"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </>
          )}

          {/* Place Order Button */}
          <button
            type="button"
            disabled={!items.length || loading}
            onClick={placeOrder}
            className="w-full py-4 rounded-xl text-lg font-semibold transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-gold)',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner" />
                Placing order...
              </span>
            ) : (
              '🍽️ Place Order'
            )}
          </button>

          <p
            className="text-xs text-center"
            style={{ color: 'var(--color-muted)' }}
          >
            🔒 Your order goes directly to our kitchen
          </p>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;

