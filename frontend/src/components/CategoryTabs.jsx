const CategoryTabs = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      <button
        type="button"
        onClick={() => onSelect('all')}
        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${activeCategory === 'all' ? 'bg-brand text-white shadow-lg' : 'bg-white text-stone-600 shadow-sm'}`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          type="button"
          onClick={() => onSelect(category._id)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${activeCategory === category._id ? 'bg-brand text-white shadow-lg' : 'bg-white text-stone-600 shadow-sm'}`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
