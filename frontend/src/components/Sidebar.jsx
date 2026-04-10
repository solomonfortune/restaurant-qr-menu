import React from 'react';
import { NavLink } from 'react-router-dom';
import GoldDivider from './GoldDivider';

/**
 * Sidebar Component
 * Navigation sidebar with luxury bistro theme
 * Slides in as drawer on mobile, fixed on desktop
 */

const menuLinks = [
  { to: '/admin/dashboard', label: '🏠 Dashboard', icon: '📊' },
  { to: '/admin/menu', label: '🍽️ Menu Items', icon: '📝' },
  { to: '/admin/categories', label: '🏷️ Categories', icon: '🏷️' },
  { to: '/admin/orders', label: '📋 Orders', icon: '📋' },
  { to: '/admin/tables', label: '🪑 Tables', icon: '🪑' },
];

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 lg:hidden"
          onClick={onClose}
          style={{ backgroundColor: 'rgba(44, 26, 14, 0.6)' }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col overflow-hidden transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--color-espresso)',
          borderRight: '1px solid var(--color-divider)',
        }}
      >
        {/* Header Section */}
        <div
          className="border-b p-6 space-y-4"
          style={{
            borderColor: 'var(--color-divider)',
          }}
        >
          {/* Logo */}
          <div className="space-y-2">
            <div
              className="w-10 h-10 flex items-center justify-center rounded-lg"
              style={{ backgroundColor: 'var(--color-gold)' }}
            >
              <span style={{ color: 'var(--color-espresso)', fontSize: '20px' }}>✕</span>
            </div>
            <h1
              className="font-display text-2xl font-bold"
              style={{ color: 'var(--color-gold)' }}
            >
              Digital Diner
            </h1>
            <p
              className="text-xs"
              style={{ color: 'var(--color-muted)' }}
            >
              Restaurant Command Center
            </p>
          </div>

          <GoldDivider />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2 p-4">
          {menuLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-semibold transition ${
                  isActive ? 'font-bold' : ''
                }`
              }
              style={(params) => ({
                backgroundColor: params.isActive
                  ? 'rgba(201, 168, 76, 0.15)'
                  : 'transparent',
                borderLeft: params.isActive ? '3px solid var(--color-gold)' : 'none',
                paddingLeft: params.isActive ? '13px' : '16px',
                color: params.isActive ? 'var(--color-gold)' : 'var(--color-muted)',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div
          className="border-t p-4 space-y-3"
          style={{
            borderColor: 'var(--color-divider)',
          }}
        >
          <button
            type="button"
            onClick={onLogout}
            className="w-full px-4 py-3 rounded-lg text-sm font-semibold transition text-center"
            style={{
              backgroundColor: 'rgba(201, 168, 76, 0.1)',
              color: 'var(--color-gold)',
              border: '1px solid var(--color-gold)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(201, 168, 76, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(201, 168, 76, 0.1)';
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
