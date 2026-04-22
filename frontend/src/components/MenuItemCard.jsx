import { useCart } from '../context/CartContext';

function MenuItemCard({ item }) {
  const { addItem, updateQuantity, items: cartItems } = useCart();
  const cartItem = cartItems.find(ci => ci._id === item._id);
  const quantity = cartItem?.quantity || 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAdd = () => {
    addItem(item);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    updateQuantity(item._id, quantity + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateQuantity(item._id, quantity - 1);
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${!item.isAvailable ? 'opacity-60' : ''}`}>
      <div className="relative h-40 bg-gray-200">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        {item.isPopular && (
          <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
            Popular
          </span>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-semibold">Unavailable</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-dark text-lg mb-1">{item.name}</h3>
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-primary font-bold">{formatPrice(item.price)}</span>
          {item.preparationTime && (
            <span className="text-gray-400 text-sm">{item.preparationTime} min</span>
          )}
        </div>
        {item.isAvailable ? (
          quantity > 0 ? (
            <div className="flex items-center justify-between mt-3 bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-md"
              >
                −
              </button>
              <span className="font-semibold">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-md"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="w-full mt-3 bg-primary text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Add to Cart
            </button>
          )
        ) : null}
      </div>
    </div>
  );
}

export default MenuItemCard;