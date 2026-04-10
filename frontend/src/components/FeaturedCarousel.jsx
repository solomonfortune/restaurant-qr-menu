import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

/**
 * FeaturedCarousel Component
 * Auto-scrolling carousel for popular/featured dishes
 */
const FeaturedCarousel = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    if (items.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) return null;

  const current = items[currentIndex];

  return (
    <div className="space-y-4">
      <div
        className="relative rounded-2xl overflow-hidden h-64 sm:h-72"
        style={{
          backgroundColor: 'var(--color-cream-dark)',
          animation: 'fadeUp 0.6s ease-out',
        }}
      >
        <img
          src={current.image || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80'}
          alt={current.name}
          className="w-full h-full object-cover"
          style={{ animation: 'fadeUp 0.3s ease-out' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="font-display text-2xl mb-2">{current.name}</h3>
          <p className="text-sm opacity-90 line-clamp-2">{current.description}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xl font-display" style={{ color: 'var(--color-gold)' }}>
              UGX {current.price.toLocaleString()}
            </span>
            <button
              type="button"
              onClick={() => addItem(current)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-gold)',
                color: 'var(--color-espresso)',
              }}
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Indicator Dots */}
      <div className="flex justify-center gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className="w-2 h-2 rounded-full transition"
            style={{
              backgroundColor: idx === currentIndex ? 'var(--color-primary)' : 'var(--color-divider)',
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
