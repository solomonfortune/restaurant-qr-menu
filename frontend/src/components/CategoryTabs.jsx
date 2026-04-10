import React, { useEffect, useRef, useState } from 'react';

/**
 * CategoryTabs Component
 * Horizontally scrollable tabs with sliding gold underline indicator
 */
const CategoryTabs = ({ categories, activeCategory, onSelect }) => {
  const containerRef = useRef(null);
  const activeTabRef = useRef(null);
  const [underlineStyle, setUnderlineStyle] = useState({});

  // Update underline position when active category changes
  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const activeTab = activeTabRef.current;
      const container = containerRef.current;

      setUnderlineStyle({
        left: `${activeTab.offsetLeft}px`,
        width: `${activeTab.offsetWidth}px`,
      });

      // Scroll active tab into view
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCategory]);

  return (
    <div
      className="relative no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0"
      ref={containerRef}
    >
      {/* All Button */}
      <button
        type="button"
        onClick={() => onSelect('all')}
        ref={activeCategory === 'all' ? activeTabRef : null}
        className="whitespace-nowrap px-4 py-2 text-sm font-semibold transition rounded-full"
        style={{
          backgroundColor: activeCategory === 'all' ? 'var(--color-primary)' : 'transparent',
          color: activeCategory === 'all' ? 'var(--color-gold)' : 'var(--color-muted)',
          borderBottom: activeCategory === 'all' ? 'none' : '2px solid var(--color-divider)',
        }}
      >
        All
      </button>

      {/* Category Buttons */}
      {categories.map((category) => (
        <button
          key={category._id}
          type="button"
          onClick={() => onSelect(category._id)}
          ref={activeCategory === category._id ? activeTabRef : null}
          className="whitespace-nowrap px-4 py-2 text-sm font-semibold transition rounded-full"
          style={{
            backgroundColor: activeCategory === category._id ? 'var(--color-primary)' : 'transparent',
            color: activeCategory === category._id ? 'var(--color-gold)' : 'var(--color-muted)',
            borderBottom: activeCategory === category._id ? 'none' : '2px solid var(--color-divider)',
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
