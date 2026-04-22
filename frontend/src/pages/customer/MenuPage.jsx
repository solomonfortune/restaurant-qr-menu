import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../api/axios';
import MenuItemCard from '../../components/MenuItemCard';
import CategoryTabs from '../../components/CategoryTabs';
import CartDrawer from '../../components/CartDrawer';
import LoadingSpinner from '../../components/LoadingSpinner';

function MenuPage() {
  const [searchParams] = useSearchParams();
  const { setTableNumber, setOwnerId, totalItems, openCart } = useCart();
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const ownerId = searchParams.get('owner');
  const tableNumber = searchParams.get('table');

  useEffect(() => {
    if (!ownerId) {
      setError('Invalid QR code. Please scan again.');
      setLoading(false);
      return;
    }

    setTableNumber(tableNumber);
    setOwnerId(ownerId);

    const fetchMenu = async () => {
      try {
        const response = await api.get(`/menu/public?ownerId=${ownerId}`);
        setMenu(response.data.menu || []);
        
        const allCategories = [];
        response.data.menu?.forEach(group => {
          if (!allCategories.find(c => c.name === group.category)) {
            allCategories.push({ _id: group.category, name: group.category });
          }
        });
        setCategories(allCategories);
      } catch (err) {
        setError('Failed to load menu. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [ownerId, tableNumber, setTableNumber, setOwnerId]);

  const filteredMenu = activeCategory
    ? menu.filter(group => group.category === activeCategory)
    : menu;

  const allItems = filteredMenu.flatMap(group => group.items);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-primary text-white p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center">Digital Menu</h1>
        {tableNumber && (
          <p className="text-center text-orange-200 text-sm mt-1">Table {tableNumber}</p>
        )}
      </header>

      <div className="py-4 px-2">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      <div className="px-2 pb-24">
        {allItems.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No items available</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {allItems.map(item => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <button
          onClick={openCart}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-full shadow-lg font-medium flex items-center gap-2"
        >
          <span>View Order ({totalItems})</span>
        </button>
      )}

      <CartDrawer />
    </div>
  );
}

export default MenuPage;