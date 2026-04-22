import { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function CartDrawer() {
  const { items, isCartOpen, closeCart, totalPrice, tableNumber, ownerId, clearCart, updateQuantity } = useCart();
  const [customerNote, setCustomerNote] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    
    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        menuItemId: item._id,
        quantity: item.quantity
      }));

      await api.post('/orders', {
        tableNumber,
        ownerId,
        items: orderItems,
        customerNote
      });

      clearCart();
      closeCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={closeCart}
      />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl overflow-y-auto">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-xl font-bold">Your Order</h2>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-orange-50">
          <span className="text-gray-600">Table {tableNumber}</span>
        </div>

        <div className="p-4 space-y-4">
          {items.map(item => (
            <div key={item._id} className="flex items-center gap-3 border-b pb-3">
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-gray-500 text-sm">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md"
                >
                  −
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-center text-gray-500 py-8">Your cart is empty</p>
          )}

          <div className="border-t pt-4">
            <label className="text-gray-600 text-sm mb-2 block">Add a note (optional)</label>
            <textarea
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="Any special requests..."
              className="w-full p-3 border rounded-lg resize-none h-20"
            />
          </div>

          {items.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-lg font-bold mb-4">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;