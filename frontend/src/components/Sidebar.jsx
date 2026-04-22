import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/admin/dashboard',  label: 'Dashboard',   icon: '📊' },
  { path: '/admin/menu',       label: 'Menu Items',  icon: '🍽️' },
  { path: '/admin/categories', label: 'Categories',  icon: '📂' },
  { path: '/admin/orders',     label: 'Live Orders', icon: '🛒' },
  { path: '/admin/tables',     label: 'Tables & QR', icon: '🪑' },
];

function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  /* Initials avatar */
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'R';

  return (
    <aside
      className="w-64 min-h-screen flex flex-col"
      style={{ background: 'var(--sidebar-bg)' }}
    >
      {/* ── Brand ──────────────────────────────────────────── */}
      <div
        className="px-6 py-7"
        style={{ borderBottom: '1px solid rgba(201,168,76,0.18)' }}
      >
        {/* Logo mark */}
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl animate-gold-glow"
            style={{ background: 'var(--color-primary)' }}
          >
            🍽️
          </div>
          <div>
            <h1
              className="font-display text-base font-bold leading-tight"
              style={{ color: 'var(--color-gold)' }}
            >
              {user?.restaurantName || 'QR Menu'}
            </h1>
            <p className="text-xs" style={{ color: 'rgba(253,246,236,0.45)' }}>
              Admin Panel
            </p>
          </div>
        </div>

        {/* Gold divider */}
        <div
          className="mt-4 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, var(--color-gold), transparent)',
            opacity: 0.35,
          }}
        />
      </div>

      {/* ── Nav links ─────────────────────────────────────── */}
      <nav className="flex-1 px-4 py-5 space-y-1">
        {navItems.map((item, i) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link animate-fade-left stagger-${i + 1} ${isActive ? 'active' : ''}`
            }
            aria-label={item.label}
          >
            <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── User card + logout ─────────────────────────────── */}
      <div
        className="px-4 py-5"
        style={{ borderTop: '1px solid rgba(201,168,76,0.18)' }}
      >
        {/* User info */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-3"
          style={{ background: 'rgba(201,168,76,0.08)' }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-display flex-shrink-0"
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-gold-light)',
            }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-semibold truncate"
              style={{ color: 'var(--color-cream)' }}
            >
              {user?.name || 'Restaurant Owner'}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: 'rgba(253,246,236,0.45)' }}
            >
              {user?.email || ''}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-left"
          style={{ color: '#FCA5A5' }}
          aria-label="Logout"
        >
          <span style={{ fontSize: '18px' }}>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
