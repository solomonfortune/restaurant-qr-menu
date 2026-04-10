import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import OrderCard from '../../components/OrderCard';
import api from '../../api/axios';

/**
 * OrdersPage Component
 * Kanban board layout with 6 status columns
 * Live updates every 15 seconds with notifications
 */

const statusConfig = {
  pending: { label: 'Pending', color: '#F59E0B', icon: '⏳', emoji: '📥' },
  confirmed: { label: 'Confirmed', color: '#3B82F6', icon: '✓', emoji: '✅' },
  preparing: { label: 'Preparing', color: '#EA580C', icon: '🍳', emoji: '🍳' },
  ready: { label: 'Ready', color: '#16A34A', icon: '✓', emoji: '✔️' },
  completed: { label: 'Completed', color: '#6B7280', icon: '✓', emoji: '🎉' },
  cancelled: { label: 'Cancelled', color: '#DC2626', icon: '✕', emoji: '❌' },
};

const statusColumns = Object.keys(statusConfig);

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const knownPendingIds = useRef(new Set());

  useEffect(() => {
    let intervalId;

    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        const pendingIds = data
          .filter((order) => order.status === 'pending')
          .map((order) => order._id);
        const newPending = pendingIds.filter(
          (id) => !knownPendingIds.current.has(id)
        );

        // Show browser notification for new pending orders
        if (newPending.length && window.Notification) {
          if (Notification.permission === 'granted') {
            new Notification('🔔 New Order!', {
              body: `${newPending.length} new order(s) just came in.`,
              icon: '🍽️',
            });
          }
        }

        knownPendingIds.current = new Set(pendingIds);
        setOrders(data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || 'Could not load orders.'
        );
      }
    };

    // Request notification permission
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    fetchOrders();
    intervalId = setInterval(fetchOrders, 15000);
    return () => clearInterval(intervalId);
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 'Could not update order status.'
      );
    }
  };

  return (
    <AdminLayout
      title="Orders"
      subtitle="Live Kanban board - track every order from kitchen to table"
    >
      {error && (
        <div
          className="rounded-lg px-6 py-4 text-sm mb-6"
          style={{
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
          }}
        >
          {error}
        </div>
      )}

      {/* Live Indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div
          className="w-3 h-3 rounded-full animate-pulse"
          style={{
            backgroundColor: '#16A34A',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        <p style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
          🔴 Live • Updates every 15 seconds
        </p>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-6 -mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${statusColumns.length}, minmax(300px, 1fr))`, minWidth: 'min(100%, 1800px)' }}>
          {statusColumns.map((status) => {
            const config = statusConfig[status];
            const statusOrders = orders.filter(
              (order) => order.status === status
            );

            return (
              <section
                key={status}
                className="rounded-xl p-4 space-y-4 min-h-96"
                style={{
                  backgroundColor: 'var(--color-cream-dark)',
                  borderTop: `4px solid ${config.color}`,
                }}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between sticky top-0">
                  <h3
                    className="font-display text-lg font-bold"
                    style={{ color: 'var(--color-espresso)' }}
                  >
                    {config.emoji} {config.label}
                  </h3>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: config.color }}
                  >
                    {statusOrders.length}
                  </div>
                </div>

                <div
                  className="h-px"
                  style={{ backgroundColor: config.color, opacity: 0.3 }}
                />

                {/* Order Cards */}
                <div className="space-y-4">
                  {statusOrders.map((order) => (
                    <div
                      key={order._id}
                      style={{
                        animation: 'fadeUp 0.4s ease-out',
                      }}
                    >
                      <OrderCard
                        order={order}
                        onStatusChange={updateStatus}
                      />
                    </div>
                  ))}

                  {statusOrders.length === 0 && (
                    <div
                      className="rounded-lg p-6 text-center"
                      style={{
                        backgroundColor: 'var(--color-white)',
                        opacity: 0.6,
                      }}
                    >
                      <p
                        className="text-sm"
                        style={{ color: 'var(--color-muted)' }}
                      >
                        No {status} orders right now
                      </p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
