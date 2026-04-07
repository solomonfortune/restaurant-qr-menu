import { useCart } from '../context/CartContext';

const MenuItemCard = ({ item }) => {
  const { items, addItem, updateQuantity } = useCart();
  const cartEntry = items.find((entry) => entry._id === item._id);

  return (
    <article className="relative overflow-hidden rounded-[28px] bg-white shadow-card transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-36 overflow-hidden bg-stone-100">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80'}
          alt={item.name}
          className="h-full w-full object-cover"
        />
        {item.isPopular && <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">Popular</span>}
        {item.isAvailable === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-950/55 text-sm font-semibold text-white">
            Unavailable
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg text-stone-900">{item.name}</h3>
            <span className="rounded-full bg-brand/10 px-2 py-1 text-xs font-semibold text-brand">UGX {item.price.toLocaleString()}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-stone-500">{item.description}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-stone-400">
          <span>{item.preparationTime || 15} mins</span>
          <span>{item.allergens?.length ? item.allergens.join(', ') : 'No listed allergens'}</span>
        </div>

        {!cartEntry ? (
          <button
            type="button"
            disabled={item.isAvailable === false}
            onClick={() => addItem(item)}
            className="w-full rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            Add To Cart
          </button>
        ) : (
          <div className="flex items-center justify-between rounded-2xl bg-brand-soft px-4 py-3">
            <button type="button" onClick={() => updateQuantity(item._id, cartEntry.quantity - 1)} className="h-10 w-10 rounded-full bg-white text-lg font-semibold text-brand shadow-sm">-</button>
            <span className="text-sm font-semibold text-stone-800">{cartEntry.quantity} in cart</span>
            <button type="button" onClick={() => updateQuantity(item._id, cartEntry.quantity + 1)} className="h-10 w-10 rounded-full bg-brand text-lg font-semibold text-white shadow-sm">+</button>
          </div>
        )}
      </div>
    </article>
  );
};

export default MenuItemCard;
