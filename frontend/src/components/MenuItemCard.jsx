import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import DishDetailModal from './DishDetailModal';

/**
 * MenuItemCard Component
 * Displays a menu item with image, details, price, and add/quantity controls
 */
const MenuItemCard = ({ item }) => {
  const { items, addItem, updateQuantity } = useCart();
  const [showModal, setShowModal] = useState(false);
  
  const cartEntry = items.find((entry) => entry._id === item._id);
  const isAvailable = item.isAvailable !== false;

  const handleCardClick = (e) => {
    // Don't open modal if clicking the add/quantity buttons
    if (e.target.closest('button')) return;
    if (isAvailable) setShowModal(true);
  };

  return (
    <>
      <article
        className="rounded-2xl overflow-hidden transition cursor-pointer group"
        style={{
          backgroundColor: 'var(--color-cream-dark)',
          border: '1px solid var(--color-divider)',
          boxShadow: 'var(--shadow-card)',
          animation: 'fadeUp 0.6s ease-out',
        }}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && isAvailable) setShowModal(true);
        }}
      >
        {/* Image Section */}
        <div
          className="relative h-48 overflow-hidden"
          style={{ backgroundColor: 'var(--color-cream)' }}
        >
          <img
            src={
              item.image || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80'
            }
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          />

          {/* Popular Badge */}
          {item.isPopular && (
            <div
              className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1"
              style={{
                backgroundColor: 'var(--color-gold)',
                color: 'var(--color-espresso)',
                fontFamily: 'var(--font-accent)',
              }}
            >
              ★ Popular
            </div>
          )}

          {/* Chef's Special Badge */}
          {item.isChefSpecial && (
            <div
              className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-accent)',
              }}
            >
              ✨ Chef's Special
            </div>
          )}

          {/* Unavailable Overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-white text-sm font-semibold">Currently Unavailable</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Name & Price */}
          <div>
            <h3
              className="font-display text-lg font-bold line-clamp-2"
              style={{ color: 'var(--color-espresso)' }}
            >
              {item.name}
            </h3>
            <p
              className="text-sm line-clamp-2 mt-1"
              style={{ color: 'var(--color-muted)' }}
            >
              {item.description}
            </p>
          </div>

          {/* Divider */}
          <div
            className="h-px"
            style={{ backgroundColor: 'var(--color-gold)', opacity: 0.3 }}
          />

          {/* Info Row - Prep Time, Allergens, Dietary */}
          <div className="flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="flex items-center gap-1" style={{ color: 'var(--color-muted)' }}>
              <span>⏱</span>
              <span>{item.preparationTime || 15} min</span>
            </div>

            {/* Dietary Tags */}
            <div className="flex gap-1">
              {item.isVegetarian && <span title="Vegetarian">🌱</span>}
              {item.isSpicy && <span title="Spicy">🌶</span>}
              {item.isGlutenFree && <span title="Gluten Free">🌾</span>}
            </div>
          </div>

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="text-xs" style={{ color: 'var(--color-gold)' }}>
              Allergens: {item.allergens.join(', ')}
            </div>
          )}

          {/* Price & Add/Quantity Controls */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <span
              className="font-display text-xl font-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              UGX {item.price.toLocaleString()}
            </span>

            {!cartEntry ? (
              <button
                type="button"
                disabled={!isAvailable}
                onClick={() => addItem(item)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition"
                style={{
                  backgroundColor: isAvailable ? 'var(--color-primary)' : '#CCC',
                  color: 'var(--color-gold)',
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                }}
                aria-label={`Add ${item.name} to cart`}
              >
                + Add
              </button>
            ) : (
              <div
                className="flex items-center gap-2 px-2 py-1 rounded-full"
                style={{
                  backgroundColor: 'var(--color-primary)',
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(item._id, cartEntry.quantity - 1);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold transition"
                  style={{
                    backgroundColor: 'var(--color-gold)',
                    color: 'var(--color-espresso)',
                  }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span
                  className="w-6 text-center text-xs font-semibold"
                  style={{ color: 'var(--color-gold)' }}
                >
                  {cartEntry.quantity}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(item._id, cartEntry.quantity + 1);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold transition"
                  style={{
                    backgroundColor: 'var(--color-gold)',
                    color: 'var(--color-espresso)',
                  }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Dish Detail Modal */}
      {showModal && (
        <DishDetailModal item={item} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default MenuItemCard;
