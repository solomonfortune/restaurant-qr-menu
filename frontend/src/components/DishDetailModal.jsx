import React from 'react';
import { useCart } from '../context/CartContext';

/**
 * DishDetailModal Component
 * Full-screen modal on mobile, centered modal on desktop
 * Shows dish details with option to add to cart
 */
const DishDetailModal = ({ item, onClose }) => {
  const { addItem, items, updateQuantity } = useCart();
  const cartEntry = items.find((entry) => entry._id === item._id);

  const handleAddToCart = () => {
    if (cartEntry) {
      updateQuantity(item._id, cartEntry.quantity + 1);
    } else {
      addItem(item);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 transition-opacity"
        style={{
          backgroundColor: 'rgba(44, 26, 14, 0.6)',
          animation: 'fadeUp 0.3s ease-out',
        }}
        onClick={onClose}
        role="button"
        tabIndex={-1}
      />

      {/* Modal - Full screen on mobile, centered on desktop */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl md:bottom-auto md:left-1/2 md:top-1/2 md:max-w-xl md:rounded-2xl md:-translate-x-1/2 md:-translate-y-1/2 max-h-[90vh] md:max-h-[85vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--color-cream)',
          animation: 'slideInRight 0.4s ease-out',
        }}
      >
        {/* Header with Close Button */}
        <div
          className="sticky top-0 flex items-center justify-between p-4 md:p-6 border-b"
          style={{
            backgroundColor: 'var(--color-cream)',
            borderColor: 'var(--color-divider)',
          }}
        >
          <h2
            className="font-display text-2xl"
            style={{ color: 'var(--color-espresso)' }}
          >
            {item.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none"
            style={{ color: 'var(--color-muted)' }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Full Image */}
          <div
            className="rounded-xl overflow-hidden h-64"
            style={{ backgroundColor: 'var(--color-cream-dark)' }}
          >
            <img
              src={
                item.image || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80'
              }
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Full Description */}
          <div>
            <p style={{ color: 'var(--color-charcoal)', lineHeight: '1.6' }}>
              {item.description}
            </p>
          </div>

          {/* Prep Time & Dietary Info */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="p-3 rounded-lg"
              style={{
                backgroundColor: 'var(--color-cream-dark)',
              }}
            >
              <p
                className="text-xs uppercase tracking-wider font-semibold mb-1"
                style={{ color: 'var(--color-muted)' }}
              >
                Prep Time
              </p>
              <p
                className="text-lg font-display"
                style={{ color: 'var(--color-espresso)' }}
              >
                ⏱ {item.preparationTime || 15} min
              </p>
            </div>

            <div
              className="p-3 rounded-lg"
              style={{
                backgroundColor: 'var(--color-cream-dark)',
              }}
            >
              <p
                className="text-xs uppercase tracking-wider font-semibold mb-1"
                style={{ color: 'var(--color-muted)' }}
              >
                Dietary
              </p>
              <div className="flex gap-2">
                {item.isVegetarian && <span title="Vegetarian">🌱</span>}
                {item.isSpicy && <span title="Spicy">🌶</span>}
                {item.isGlutenFree && <span title="Gluten Free">🌾</span>}
              </div>
            </div>
          </div>

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div>
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: 'var(--color-espresso)' }}
              >
                ⚠️ Allergens
              </p>
              <div className="flex flex-wrap gap-2">
                {item.allergens.map((allergen, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: '#FEE2E2',
                      color: '#991B1B',
                    }}
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div
            className="p-4 rounded-lg border-2"
            style={{
              backgroundColor: `var(--color-primary)`,
              borderColor: 'var(--color-gold)',
            }}
          >
            <p
              className="text-xs uppercase tracking-wider font-semibold opacity-80 mb-1"
              style={{ color: 'var(--color-gold)' }}
            >
              Price
            </p>
            <p
              className="font-display text-3xl font-bold"
              style={{ color: 'var(--color-gold)' }}
            >
              UGX {item.price.toLocaleString()}
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-4 rounded-xl text-lg font-semibold transition hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-gold)',
            }}
          >
            {cartEntry ? `✓ Add Another` : 'Add to Order'}
          </button>

          {cartEntry && (
            <div
              className="p-4 rounded-lg text-center"
              style={{
                backgroundColor: 'var(--color-cream-dark)',
                borderLeft: '4px solid var(--color-gold)',
              }}
            >
              <p
                className="text-sm"
                style={{ color: 'var(--color-muted)' }}
              >
                Already in cart: <strong>{cartEntry.quantity}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DishDetailModal;
