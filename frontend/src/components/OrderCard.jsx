const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  ready: 'bg-green-100 text-green-700',
  completed: 'bg-stone-200 text-stone-700',
  cancelled: 'bg-red-100 text-red-700',
};

const OrderCard = ({ order, onStatusChange }) => {
  const minutesAgo = Math.max(1, Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000));

  return (
    <article className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Table {order.tableNumber}</p>
          <h3 className="mt-1 text-lg font-semibold text-stone-900">UGX {order.totalAmount.toLocaleString()}</h3>
          <p className="mt-1 text-sm text-stone-500">{minutesAgo} minute(s) ago</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[order.status]}`}>{order.status}</span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-stone-600">
        {order.items.map((item) => (
          <div key={`${order._id}-${item.menuItem?._id || item.name}`} className="flex items-center justify-between">
            <span>{item.quantity} x {item.name || item.menuItem?.name}</span>
            <span>UGX {(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      {order.customerNote && <p className="mt-4 rounded-2xl bg-brand-soft px-4 py-3 text-sm text-stone-600">Note: {order.customerNote}</p>}

      <select value={order.status} onChange={(event) => onStatusChange(order._id, event.target.value)} className="mt-4 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-brand">
        {['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
    </article>
  );
};

export default OrderCard;
