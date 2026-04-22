import { useState } from 'react';
import api from '../api/axios';

function OrderCard({ order, onUpdate }) {
  const [status, setStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTimeAgo = (date) => {
    const minutes = Math.floor((new Date() - new Date(date)) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await api.patch(`/orders/${order._id}/status`, { status: newStatus });
      setStatus(newStatus);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">Table {order.tableNumber}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <span className="text-gray-400 text-sm">{getTimeAgo(order.createdAt)}</span>
      </div>

      <div className="space-y-2 mb-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span>{item.quantity}x {item.name}</span>
            <span className="text-gray-500">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {order.customerNote && (
        <div className="bg-orange-50 p-2 rounded-lg text-sm text-gray-600 mb-3">
          Note: {order.customerNote}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t">
        <span className="font-bold">{formatPrice(order.totalAmount)}</span>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={updating}
          className="border rounded-lg px-3 py-1 text-sm disabled:opacity-50"
        >
          {statusOptions.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default OrderCard;