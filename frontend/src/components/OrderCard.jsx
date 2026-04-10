import React from 'react';
import { timeAgo } from '../utils/timeAgo';

/**
 * OrderCard Component
 * Kanban-style card for order management
 * Displays order details and status change dropdown
 */

const statusConfig = {
  pending: { icon: '⏳', color: '#F59E0B', bg: '#FEF3C7' },
  confirmed: { icon: '✓', color: '#3B82F6', bg: '#DBEAFE' },
  preparing: { icon: '🍳', color: '#EA580C', bg: '#FFEDD5' },
  ready: { icon: '✓✓', color: '#16A34A', bg: '#DCFCE7' },
  completed: { icon: '✓', color: '#6B7280', bg: '#F3F4F6' },
  cancelled: { icon: '✕', color: '#DC2626', bg: '#FEE2E2' },
};

const OrderCard = ({ order, onStatusChange }) => {
  const config = statusConfig[order.status] || statusConfig.pending;

  return (
    <article
      className="rounded-xl p-4 space-y-3 cursor-pointer transition hover:shadow-lg"
      style={{
        backgroundColor: 'var(--color-white)',
        border: `2px solid var(--color-divider)`,
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Header: Table + Time */}
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-xs uppercase tracking-widest font-semibold"
            style={{ color: 'var(--color-gold)' }}
          >
            📍 Table {order.tableNumber}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: 'var(--color-muted)' }}
          >
            {timeAgo(order.createdAt)}
          </p>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-bold text-center"
          style={{
            backgroundColor: config.bg,
            color: config.color,
          }}
        >
          {config.icon}
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-px"
        style={{ backgroundColor: 'var(--color-divider)' }}
      />

      {/* Items List */}
      <div className="space-y-2">
        {order.items.map((item, idx) => (
          <div key={`${order._id}-${idx}`} className="flex items-start justify-between text-sm">
            <span
              style={{
                color: 'var(--color-charcoal)',
                fontWeight: '500',
              }}
            >
              {item.quantity}×{' '}
              {item.name || item.menuItem?.name}
            </span>
            <span
              className="font-semibold"
              style={{ color: 'var(--color-primary)' }}
            >
              UGX {(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div
        className="px-3 py-2 rounded-lg"
        style={{
          backgroundColor: 'var(--color-cream-dark)',
          borderLeft: '3px solid var(--color-gold)',
        }}
      >
        <p
          className="font-display font-bold"
          style={{ color: 'var(--color-primary)' }}
        >
          UGX {order.totalAmount.toLocaleString()}
        </p>
      </div>

      {/* Customer Note */}
      {order.customerNote && (
        <div
          className="p-2 rounded-lg text-xs italic"
          style={{
            backgroundColor: 'var(--color-cream-dark)',
            color: 'var(--color-charcoal)',
          }}
        >
          💬 {order.customerNote}
        </div>
      )}

      {/* Status Dropdown */}
      <select
        value={order.status}
        onChange={(e) => onStatusChange(order._id, e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm font-semibold transition"
        style={{
          backgroundColor: config.bg,
          color: config.color,
          border: `2px solid ${config.color}`,
          cursor: 'pointer',
        }}
      >
        {['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map(
          (status) => (
            <option key={status} value={status}>
              {statusConfig[status].icon} {status.toUpperCase()}
            </option>
          )
        )}
      </select>
    </article>
  );
};

export default OrderCard;
