import { useEffect, useState, useRef, useCallback } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import OrderCard from '../../components/OrderCard';
import LoadingSpinner from '../../components/LoadingSpinner';

/* Web Audio chime — no audio file needed */
function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [[880, 0], [1100, 0.18]].forEach(([freq, delay]) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.22, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.55);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.6);
    });
  } catch (_) { /* AudioContext blocked — silent fail */ }
}

/* Toast notification */
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg animate-toast-in"
      style={{
        background: 'var(--color-primary)',
        color: 'var(--color-gold-light)',
        boxShadow: 'var(--shadow-float)',
        maxWidth: '320px',
      }}
    >
      <span className="text-xl animate-heartbeat">🔔</span>
      <p className="font-display text-sm flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-lg opacity-70 hover:opacity-100 transition"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

/* Column header */
function ColumnHeader({ label, count, accent }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl mb-3"
      style={{ background: `${accent}12`, border: `1px solid ${accent}30` }}
    >
      <h2
        className="font-display text-base font-bold"
        style={{ color: 'var(--color-espresso)' }}
      >
        {label}
      </h2>
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-display"
        style={{ background: accent, color: 'white' }}
      >
        {count}
      </span>
    </div>
  );
}

/* Empty column placeholder */
function EmptyColumn({ label }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-10 rounded-xl text-center"
      style={{ border: '1.5px dashed var(--color-divider)' }}
    >
      <span className="text-3xl mb-2 opacity-40">📭</span>
      <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
        No {label.toLowerCase()} orders
      </p>
    </div>
  );
}

const STATUS_GROUPS = [
  { key: 'pending',   label: 'Pending',   accent: '#D97706' },
  { key: 'preparing', label: 'Preparing', accent: '#EA580C' },
  { key: 'ready',     label: 'Ready',     accent: '#16A34A' },
  { key: 'completed', label: 'Completed', accent: '#6B7280' },
];

function OrdersPage() {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [toast, setToast]             = useState(null);
  const [pulsing, setPulsing]         = useState(false);
  const prevPendingCount              = useRef(0);
  const prevOrderIds                  = useRef(new Set());

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await api.get('/orders');
      const newOrders     = data.orders || [];
      const pendingCount  = newOrders.filter((o) => o.status === 'pending').length;

      /* Detect brand-new order IDs */
      const newIds = newOrders.map((o) => o._id);
      const isNew  = newIds.some((id) => !prevOrderIds.current.has(id));

      if (isNew && prevOrderIds.current.size > 0) {
        playChime();
        setPulsing(true);
        setTimeout(() => setPulsing(false), 3000);
        const newest = newOrders.find((o) => !prevOrderIds.current.has(o._id));
        if (newest) {
          setToast(`New order from Table ${newest.tableNumber}! 🍽️`);
          /* Flash browser tab */
          const orig = document.title;
          document.title = `🔔 New Order! | ${orig}`;
          setTimeout(() => { document.title = orig; }, 5000);
        }
      }

      prevOrderIds.current   = new Set(newIds);
      prevPendingCount.current = pendingCount;
      setOrders(newOrders);
    } catch (err) {
      console.error('Orders fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const grouped = STATUS_GROUPS.reduce((acc, g) => {
    acc[g.key] = orders.filter((o) => o.status === g.key);
    return acc;
  }, {});

  if (loading) return <LoadingSpinner />;

  return (
    <Navbar title="Live Orders">

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Page header */}
      <div className="flex items-center justify-between mb-6 animate-fade-up">
        <div className="flex items-center gap-3">
          <h1
            className="font-display text-2xl"
            style={{ color: 'var(--color-espresso)' }}
          >
            Live Orders
          </h1>
          {/* Live pulse indicator */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: pulsing ? 'var(--color-primary)' : '#16A34A',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
              {pulsing ? 'New order!' : 'Live'}
            </span>
          </div>
        </div>
        <button
          onClick={fetchOrders}
          className="btn-outline-gold text-xs px-4 py-2"
          aria-label="Refresh orders"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATUS_GROUPS.map((group, i) => (
          <div
            key={group.key}
            className="animate-fade-up"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <ColumnHeader
              label={group.label}
              count={grouped[group.key].length}
              accent={group.accent}
            />

            <div className="space-y-3">
              {grouped[group.key].length === 0 ? (
                <EmptyColumn label={group.label} />
              ) : (
                grouped[group.key].map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onUpdate={fetchOrders}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Cancelled orders — collapsible */}
      {orders.filter((o) => o.status === 'cancelled').length > 0 && (
        <details className="mt-8 animate-fade-up">
          <summary
            className="cursor-pointer text-sm font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-2"
            style={{ background: '#FEE2E2', color: '#991B1B' }}
          >
            ✕ Cancelled ({orders.filter((o) => o.status === 'cancelled').length})
          </summary>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-3">
            {orders
              .filter((o) => o.status === 'cancelled')
              .map((order) => (
                <OrderCard key={order._id} order={order} onUpdate={fetchOrders} />
              ))}
          </div>
        </details>
      )}
    </Navbar>
  );
}

export default OrdersPage;
