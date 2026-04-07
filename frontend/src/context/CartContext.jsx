import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = (item) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((entry) => entry._id === item._id);

      if (existingItem) {
        return currentItems.map((entry) => (
          entry._id === item._id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        ));
      }

      return [...currentItems, { ...item, menuItem: item._id, quantity: 1 }];
    });
  };

  const removeItem = (itemId) => {
    setItems((currentItems) => currentItems.filter((entry) => entry._id !== itemId));
  };

  const updateQuantity = (itemId, qty) => {
    if (qty <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((currentItems) => currentItems.map((entry) => (
      entry._id === itemId ? { ...entry, quantity: qty } : entry
    )));
  };

  const clearCart = () => setItems([]);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const setTableContext = (table, owner) => {
    setTableNumber(table || '');
    setOwnerId(owner || '');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value = useMemo(() => ({
    items,
    tableNumber,
    ownerId,
    isCartOpen,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    setTableContext,
  }), [items, tableNumber, ownerId, isCartOpen, totalItems, totalPrice]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
