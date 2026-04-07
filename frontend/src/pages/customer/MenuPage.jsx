import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import CategoryTabs from '../../components/CategoryTabs';
import CartDrawer from '../../components/CartDrawer';
import LoadingSpinner from '../../components/LoadingSpinner';
import MenuItemCard from '../../components/MenuItemCard';
import { useCart } from '../../context/CartContext';

const MenuPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [menu, setMenu] = useState([]);
  const [restaurantName, setRestaurantName] = useState('Restaurant Menu');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const filteredCategories = useMemo(() => {
    if (activeCategory === 'all') return menu;
    return menu.filter((category) => category._id === activeCategory);
  }, [activeCategory, menu]);

  if (loading) {
    return <LoadingSpinner fullScreen label="Setting the table" />;
  }

  return (
    <div className="min-h-screen bg-brand-soft pb-28">
      <section className="relative overflow-hidden bg-stone-950 px-4 pb-12 pt-8 text-white sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(232,93,36,0.45),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.18),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="rounded-[32px] border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-orange-200">Table {table || '--'}</p>
            <h1 className="mt-3 max-w-xl font-display text-4xl leading-tight sm:text-5xl">{restaurantName}</h1>
            <p className="mt-3 max-w-xl text-sm text-stone-200 sm:text-base">Scan, browse, and send your order straight to the kitchen. No waiting for paper menus.</p>
            <button type="button" onClick={() => navigate('/admin/login')} className="mt-6 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white hover:text-stone-900">
              Restaurant Owner Login
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-6xl px-4 sm:px-6">
        <div className="space-y-6 rounded-[32px] bg-transparent py-6">
          <CategoryTabs categories={menu} activeCategory={activeCategory} onSelect={setActiveCategory} />

          {error && <p className="rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-600">{error}</p>}

          {!error && filteredCategories.map((category) => (
            <div key={category._id} className="space-y-4">
              <div>
                <h2 className="font-display text-2xl text-stone-900">{category.name}</h2>
                <p className="text-sm text-stone-500">{category.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                {category.items.map((item) => <MenuItemCard key={item._id} item={item} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <button type="button" onClick={openCart} className="fixed bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full bg-brand px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-brand/30">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-white/70 opacity-75 animate-ping" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </span>
        View Cart
        <span className="rounded-full bg-white/20 px-2 py-1 text-xs">{totalItems}</span>
      </button>

      <CartDrawer />
    </div>
  );
};

export default MenuPage;
