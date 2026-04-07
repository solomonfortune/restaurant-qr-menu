import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/menu', label: 'Menu Items' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/tables', label: 'Tables' },
];

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  return (
    <>
      {isOpen && <button type="button" className="fixed inset-0 z-30 bg-stone-950/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-stone-950 text-stone-100 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="border-b border-stone-800 px-6 py-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand">QR Menu</p>
          <h1 className="mt-2 font-display text-2xl text-white">Digital Diner Console</h1>
          <p className="mt-2 text-sm text-stone-400">Run your restaurant from one clean dashboard.</p>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => `block rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-brand text-white' : 'text-stone-300 hover:bg-stone-900 hover:text-white'}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-stone-800 p-4">
          <button type="button" onClick={onLogout} className="w-full rounded-2xl border border-stone-700 px-4 py-3 text-sm font-medium text-stone-200 transition hover:border-brand hover:text-white">
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
