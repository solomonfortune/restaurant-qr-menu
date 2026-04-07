import { useEffect, useRef, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import OrderCard from '../../components/OrderCard';
import api from '../../api/axios';

const statusColumns = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const knownPendingIds = useRef(new Set());

  useEffect(() => {
    let intervalId;

    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        const pendingIds = data.filter((order) => order.status === 'pending').map((order) => order._id);
        const newPending = pendingIds.filter((id) => !knownPendingIds.current.has(id));

        if (newPending.length && window.Notification && Notification.permission === 'granted') {
          new Notification('New pending order', {
            body: `${newPending.length} new order(s) just came in.`,
          });
        }

        knownPendingIds.current = new Set(pendingIds);
        setOrders(data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load orders.');
      }
    };

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
      setError(requestError.response?.data?.message || 'Could not update order status.');
    }
  };

  return (
    <AdminLayout title="Orders" subtitle="Track the live board and keep the kitchen moving">
      {error && <p className="mb-6 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-600">{error}</p>}
      <div className="grid gap-5 xl:grid-cols-3 2xl:grid-cols-6">
        {statusColumns.map((status) => (
          <section key={status} className="rounded-[28px] bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl capitalize text-stone-900">{status}</h3>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">{orders.filter((order) => order.status === status).length}</span>
            </div>
            <div className="space-y-4">
              {orders.filter((order) => order.status === status).map((order) => (
                <OrderCard key={order._id} order={order} onStatusChange={updateStatus} />
              ))}
              {!orders.some((order) => order.status === status) && <p className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-500">No {status} orders right now.</p>}
            </div>
          </section>
        ))}
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
