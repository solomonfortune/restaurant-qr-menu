import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import CategoryTabs from '../../components/CategoryTabs';
import CartDrawer from '../../components/CartDrawer';
import LoadingSpinner from '../../components/LoadingSpinner';
import MenuItemCard from '../../components/MenuItemCard';
import GoldDivider from '../../components/GoldDivider';
import FeaturedCarousel from '../../components/FeaturedCarousel';
import { useCart } from '../../context/CartContext';

const MenuPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [menu, setMenu] = useState([]);
  const [restaurantName, setRestaurantName] = useState('Restaurant Menu');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [dietaryFilters, setDietaryFilters] = useState([]);
  const { totalItems, openCart, setTableContext } = useCart();

  const table = searchParams.get('table');
  const owner = searchParams.get('owner');

  useEffect(() => {
    if (!table || !owner) {
      setError('This QR code is incomplete. Please ask the restaurant staff for a valid table code.');
      setLoading(false);
      return;
    }

    setTableContext(table, owner);

    const fetchMenu = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/menu/public?ownerId=${owner}`);
        setMenu(data.categories || []);
        setRestaurantName(data.restaurantName || 'Restaurant Menu');
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load the menu right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [owner, setTableContext, table]);

  // Collect popular items for the featured carousel (max 5)
  const featuredItems = useMemo(() => {
    return menu
      .flatMap((cat) => cat.items)
      .filter((item) => item.isPopular)
      .slice(0, 5);
  }, [menu]);

  // Filter categories + items based on search, active category, and dietary filters
  const filteredCategories = useMemo(() => {
    const cats =
      activeCategory === 'all'
        ? menu
        : menu.filter((category) => category._id === activeCategory);

    return cats
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          const matchesSearch =
            searchTerm === '' ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesDietaryFilters =
            dietaryFilters.length === 0 ||
            (dietaryFilters.includes('vegetarian') && item.isVegetarian) ||
            (dietaryFilters.includes('spicy') && item.isSpicy) ||
            (dietaryFilters.includes('popular') && item.isPopular) ||
            (dietaryFilters.includes('quick') && item.preparationTime < 10);

          return matchesSearch && matchesDietaryFilters;
        }),
      }))
      .filter((category) => category.items.length > 0);
  }, [activeCategory, menu, searchTerm, dietaryFilters]);

  const toggleDietaryFilter = (filter) => {
    setDietaryFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  // Full-screen loading state
  if (loading) {
    return <LoadingSpinner fullScreen label="Setting the table" />;
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: 'var(--color-cream)' }}>

      {/* CartDrawer — fixed overlay, must be inside the return but outside scrollable content */}
      <CartDrawer />

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 text-white"
        style={{
          background:
            'linear-gradient(135deg, var(--color-espresso) 0%, var(--color-primary) 100%)',
        }}
      >
        {/* Subtle wave texture overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0,50 Q25,0 50,50 T100,50%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.1)%22 stroke-width=%222%22/%3E%3C/svg%3E")',
          }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Table number */}
          <p
            className="text-xs uppercase tracking-widest opacity-80"
            style={{ color: 'var(--color-gold-light)' }}
          >
            Table {table || '--'}
          </p>

          {/* Restaurant name */}
          <h1
            className="mt-4 font-display text-4xl sm:text-5xl font-bold leading-tight"
            style={{ animation: 'fadeUp 0.6s ease-out' }}
          >
            {restaurantName}
          </h1>

          {/* Ornamental gold divider */}
          <div
            className="flex items-center justify-center my-4"
            style={{ animation: 'fadeUp 0.8s ease-out' }}
          >
            <div
              className="h-px w-16"
              style={{ backgroundColor: 'var(--color-gold)', opacity: 0.5 }}
            />
            <span
              className="px-3"
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '18px',
                color: 'var(--color-gold)',
                fontStyle: 'italic',
              }}
            >
              ◆
            </span>
            <div
              className="h-px w-16"
              style={{ backgroundColor: 'var(--color-gold)', opacity: 0.5 }}
            />
          </div>

          {/* Tagline */}
          <p
            className="mt-4 text-base sm:text-lg max-w-xl mx-auto opacity-90"
            style={{ animation: 'fadeUp 1.0s ease-out' }}
          >
            Crafted with passion, served with love
          </p>

          <p className="mt-2 text-sm opacity-75">
            Scan, browse, and send your order straight to the kitchen.
          </p>

          {/* Owner login link */}
          <button
            type="button"
            onClick={() => navigate('/admin/login')}
            className="mt-8 rounded-full px-6 py-3 text-sm font-semibold transition hover:opacity-90 border-2"
            style={{
              borderColor: 'var(--color-gold)',
              color: 'var(--color-gold)',
            }}
          >
            Restaurant Owner Login
          </button>
        </div>
      </section>

      {/* ── Featured Carousel ────────────────────────────────────────────── */}
      {featuredItems.length > 0 && (
        <section className="px-4 sm:px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <h2
              className="font-display text-2xl text-center mb-2"
              style={{ color: 'var(--color-espresso)' }}
            >
              ⭐ Chef's Recommendations
            </h2>
            <GoldDivider />
            <FeaturedCarousel items={featuredItems} />
          </div>
        </section>
      )}

      {/* ── Search & Filters Bar (sticky) ────────────────────────────────── */}
      <section
        className="px-4 sm:px-6 py-4 sticky top-0 z-20"
        style={{ backgroundColor: 'var(--color-cream)' }}
      >
        <div className="mx-auto max-w-4xl space-y-4">

          {/* Search input / trigger button */}
          <div className="relative">
            {showSearch ? (
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{
                  backgroundColor: 'var(--color-white)',
                  borderBottom: '2px solid var(--color-gold)',
                  color: 'var(--color-espresso)',
                  animation: 'fadeUp 0.3s ease-out',
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowSearch(true)}
                className="w-full px-4 py-3 rounded-lg text-left transition"
                style={{
                  backgroundColor: 'var(--color-cream-dark)',
                  color: 'var(--color-muted)',
                }}
              >
                🔍 Search dishes...
              </button>
            )}
          </div>

          {/* Category tabs */}
          <CategoryTabs
            categories={menu}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />

          {/* Dietary filter pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'vegetarian', label: '🌱 Vegetarian' },
              { id: 'spicy',      label: '🌶 Spicy'       },
              { id: 'popular',    label: '⭐ Popular'     },
              { id: 'quick',      label: '⚡ Quick (<10 min)' },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => toggleDietaryFilter(filter.id)}
                className="px-4 py-2 rounded-full text-sm font-medium transition border-2"
                style={{
                  backgroundColor: dietaryFilters.includes(filter.id)
                    ? 'var(--color-primary)'
                    : 'transparent',
                  borderColor: dietaryFilters.includes(filter.id)
                    ? 'var(--color-primary)'
                    : 'var(--color-divider)',
                  color: dietaryFilters.includes(filter.id)
                    ? 'var(--color-gold)'
                    : 'var(--color-espresso)',
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Menu Sections ────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-4xl space-y-12">

          {/* Error banner */}
          {error && (
            <div
              className="rounded-lg px-6 py-4 text-sm"
              style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
            >
              {error}
            </div>
          )}

          {/* Empty / no-results state */}
          {filteredCategories.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">🍴</div>
              <p style={{ color: 'var(--color-muted)' }}>
                No dishes found matching your filters.
              </p>
            </div>
          )}

          {/* Category groups */}
          {filteredCategories.map((category, idx) => (
            <div key={category._id}>

              {/* Category heading + divider */}
              <div
                style={{
                  animation: `fadeUp 0.6s ease-out ${idx * 0.1}s backwards`,
                }}
              >
                <h2
                  className="font-display text-3xl mb-1"
                  style={{ color: 'var(--color-espresso)' }}
                >
                  {category.name}
                </h2>
                {category.description && (
                  <p
                    className="text-sm mb-3"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {category.description}
                  </p>
                )}
                <GoldDivider />
              </div>

              {/* Dish cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {category.items.map((item, itemIdx) => (
                  <div
                    key={item._id}
                    style={{
                      animation: `fadeUp 0.6s ease-out ${
                        idx * 0.1 + itemIdx * 0.06
                      }s backwards`,
                    }}
                  >
                    <MenuItemCard item={item} />
                  </div>
                ))}
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* ── Floating Cart Button ─────────────────────────────────────────── */}
      {totalItems > 0 && (
        <button
          type="button"
          onClick={openCart}
          className="fixed bottom-8 right-6 z-30 flex items-center justify-center rounded-full w-16 h-16 text-2xl shadow-lg transition-transform hover:scale-110"
          style={{
            backgroundColor: 'var(--color-primary)',
            animation: 'bounceIn 0.5s ease-out',
          }}
          aria-label={`View cart with ${totalItems} items`}
        >
          🛒
          {/* Item count badge */}
          <span
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: 'var(--color-gold)',
              color: 'var(--color-espresso)',
            }}
          >
            {totalItems}
          </span>
        </button>
      )}

    </div>
  );
};

export default MenuPage;
