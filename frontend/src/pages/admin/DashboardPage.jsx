import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import GoldDivider from '../../components/GoldDivider';
import { formatPrice } from '../../utils/formatPrice';
import { timeAgo } from '../../utils/timeAgo';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

/**
 * StatCard Component with Count-Up Animation
 */
const StatCard = ({ label, value, icon, color = 'primary' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frames = 0;
    const maxFrames = 120;
    const target = parseInt(value) || 0;
    const increment = target / maxFrames;

    const interval = setInterval(() => {
      frames++;
      setDisplayValue(Math.floor(increment * frames));

      if (frames >= maxFrames) {
        setDisplayValue(target);
        clearInterval(interval);
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [value]);

  const colorMap = {
    primary: '#8B1A1A',
    gold: '#C9A84C',
    success: '#16A34A',
    warning: '#EA580C',
  };

  return (
    <article
      className="rounded-xl p-6 space-y-2"
      style={{
        backgroundColor: 'var(--color-white)',
        border: `2px solid ${colorMap[color] || colorMap.primary}`,
        boxShadow: 'var(--shadow-card)',
        animation: 'fadeUp 0.6s ease-out',
      }}
    >
      <div className="flex items-center justify-between">
        <p
          className="text-xs uppercase tracking-widest font-semibold"
          style={{ color: colorMap[color] }}
        >
          {label}
        </p>
        <span
          className="text-2xl"
          role="img"
          aria-label={label}
        >
          {icon}
        </span>
      </div>

      <div
        className="font-display text-4xl font-bold"
        style={{ color: 'var(--color-espresso)' }}
      >
        {displayValue.toLocaleString()}
      </div>
    </article>
  );
};

/**
 * RevenueChart Component - Pure CSS Bar Chart
 */
const RevenueChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div
        className="rounded-xl p-6 text-center"
        style={{
          backgroundColor: 'var(--color-cream-dark)',
        }}
      >
        <p style={{ color: 'var(--color-muted)' }}>No revenue data yet today</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline gap-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 space-y-2">
            <div
              className="rounded-t-lg transition hover:opacity-80 cursor-pointer"
              style={{
                height: `${(item.count / maxValue) * 200}px`,
                backgroundColor: 'var(--color-primary)',
                minHeight: item.count > 0 ? '20px' : '4px',
              }}
              title={`${item.hour}: ${item.count} order(s)`}
            />
            <p
              className="text-xs font-semibold text-center"
              style={{ color: 'var(--color-muted)' }}
            >
              {item.hour}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;

    const fetchStats = async () => {
      try {
        const { data } = await api.get('/orders/stats');
        setStats(data);
        setLoading(false);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || 'Could not load dashboard stats.'
        );
        setLoading(false);
      }
    };

    fetchStats();
    intervalId = setInterval(fetchStats, 30000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading dashboard" />;
  }

  // Mock revenue chart data
  const chartData = [
    { hour: '12pm', count: 2 },
    { hour: '1pm', count: 5 },
    { hour: '2pm', count: 8 },
    { hour: '3pm', count: 3 },
    { hour: '4pm', count: 0 },
    { hour: '5pm', count: 1 },
    { hour: '6pm', count: 12 },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Daily pulse of your restaurant">
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

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          label="Total Orders Today"
          value={stats?.totalOrdersToday ?? 0}
          icon="📋"
          color="primary"
        />
        <StatCard
          label="Revenue Today"
          value={stats?.totalRevenueToday ?? 0}
          icon="💰"
          color="gold"
        />
        <StatCard
          label="Menu Items"
          value={stats?.totalMenuItems ?? 0}
          icon="🍽️"
          color="success"
        />
        <StatCard
          label="Pending Orders"
          value={stats?.pendingOrders ?? 0}
          icon="⏳"
          color="warning"
        />
      </div>

      {/* Revenue Chart */}
      <section
        className="rounded-xl p-6 mb-12"
        style={{
          backgroundColor: 'var(--color-white)',
          border: '2px solid var(--color-divider)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <h2
          className="font-display text-2xl font-bold mb-2"
          style={{ color: 'var(--color-espresso)' }}
        >
          📊 Orders by Hour
        </h2>
        <GoldDivider />
        <div className="mt-6">
          <RevenueChart data={chartData} />
        </div>
      </section>

      {/* Recent Orders */}
      <section
        className="rounded-xl p-6"
        style={{
          backgroundColor: 'var(--color-white)',
          border: '2px solid var(--color-divider)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-display text-2xl font-bold"
            style={{ color: 'var(--color-espresso)' }}
          >
            📝 Recent Orders
          </h2>
          <p
            className="text-xs"
            style={{ color: 'var(--color-muted)' }}
          >
            Auto-refreshes every 30s
          </p>
        </div>
        <GoldDivider />

        <div className="space-y-3 mt-6">
          {(stats?.recentOrders || []).map((order) => (
            <div
              key={order._id}
              className="p-4 rounded-lg flex items-center justify-between"
              style={{
                backgroundColor: 'var(--color-cream-dark)',
                borderLeft: '4px solid var(--color-gold)',
              }}
            >
              <div>
                <p
                  className="font-display font-bold text-lg"
                  style={{ color: 'var(--color-espresso)' }}
                >
                  Table {order.tableNumber}
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {order.items.length} item(s) • {timeAgo(order.createdAt)}
                </p>
              </div>

              <div className="text-right">
                <p
                  className="font-display font-bold"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {formatPrice(order.totalAmount)}
                </p>
                <p
                  className="text-xs capitalize mt-1"
                  style={{ color: 'var(--color-gold)' }}
                >
                  {order.status.toUpperCase()}
                </p>
              </div>
            </div>
          ))}

          {!stats?.recentOrders?.length && (
            <p
              className="text-center py-6"
              style={{ color: 'var(--color-muted)' }}
            >
              No orders yet today.
            </p>
          )}
        </div>
      </section>
    </AdminLayout>
  );
};

export default DashboardPage;
