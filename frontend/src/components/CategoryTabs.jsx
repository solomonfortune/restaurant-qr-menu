import { useRef } from 'react';

function CategoryTabs({ categories, activeCategory, onCategoryChange }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center"
      >
        ‹
      </button>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-8"
      >
        <button
          onClick={() => onCategoryChange(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors ${
            activeCategory === null
              ? 'bg-primary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category._id}
            onClick={() => onCategoryChange(category.name)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors ${
              activeCategory === category.name
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center"
      >
        ›
      </button>
    </div>
  );
}

export default CategoryTabs;