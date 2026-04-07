import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let intervalId;

    const fetchStats = async () => {
      try {
        const { data } = await api.get('/orders/stats');
        setStats(data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load dashboard stats.');
      }
    };

    fetchStats();
    intervalId = setInterval(fetchStats, 30000);

    return () => clearInterval(intervalId);
  }, []);

  if (!stats && !error) {
    return <LoadingSpinner fullScreen label="Loading dashboard" />;
  }

  const statCards = [
    { label: 'Total Orders Today', value: stats?.totalOrdersToday ?? 0 },
    { label: 'Revenue Today (UGX)', value: (stats?.totalRevenueToday ?? 0).toLocaleString() },
    { label: 'Menu Items', value: stats?.totalMenuItems ?? 0 },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? 0 },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Daily pulse of your restaurant">
      {error && <p className="mb-6 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-600">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">{card.label}</p>
            <h3 className="mt-3 font-display text-4xl text-stone-900">{card.value}</h3>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-[28px] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl text-stone-900">Recent Orders</h3>
          <span className="text-sm text-stone-500">Auto-refreshes every 30 seconds</span>
        </div>
        <div className="space-y-4">
          {(stats?.recentOrders || []).map((order) => (
            <div key={order._id} className="flex flex-col gap-2 rounded-3xl border border-stone-100 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-stone-900">Table {order.tableNumber}</p>
                <p className="text-sm text-stone-500">{order.items.length} item(s) • {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-stone-900">UGX {order.totalAmount.toLocaleString()}</p>
                <p className="text-sm capitalize text-stone-500">{order.status}</p>
              </div>
            </div>
          ))}
          {!stats?.recentOrders?.length && <p className="text-sm text-stone-500">No orders yet today.</p>}
        </div>
      </section>
    </AdminLayout>
  );
};

export default DashboardPage;
