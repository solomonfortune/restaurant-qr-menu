import React from 'react';

/**
 * Navbar Component
 * Top navigation bar with dark mode toggle
 */
const Navbar = ({ 
  title, 
  subtitle, 
  user, 
  onMenuToggle, 
  darkMode = false, 
  onDarkModeToggle 
}) => {
  return (
    <header
      className="sticky top-0 z-20 border-b"
      style={{
        backgroundColor: 'var(--color-cream)',
        borderColor: 'var(--color-divider)',
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Left: Menu Toggle + Title */}
        <div className="flex items-center gap-4 flex-1">
          <button
            type="button"
            onClick={onMenuToggle}
            className="p-2 rounded-lg lg:hidden transition hover:opacity-70"
            style={{
              backgroundColor: 'var(--color-cream-dark)',
              color: 'var(--color-espresso)',
            }}
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 4h16v2H2V4zm0 5h16v2H2V9zm0 5h16v2H2v-2z" />
            </svg>
          </button>

          <div>
            <p
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: 'var(--color-gold)' }}
            >
              Admin Panel
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold"
              style={{ color: 'var(--color-espresso)' }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className="text-sm mt-0.5"
                style={{ color: 'var(--color-muted)' }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Dark Mode Toggle + User Info */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onDarkModeToggle}
            className="p-2 rounded-lg transition hover:opacity-70"
            style={{
              backgroundColor: 'var(--color-cream-dark)',
              color: 'var(--color-espresso)',
            }}
            aria-label="Toggle dark mode"
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* User Card */}
          <div
            className="hidden sm:block p-4 rounded-lg text-right"
            style={{
              backgroundColor: 'var(--color-cream-dark)',
              borderLeft: '4px solid var(--color-gold)',
            }}
          >
            <p
              className="text-xs uppercase tracking-wider font-semibold"
              style={{ color: 'var(--color-gold)' }}
            >
              Signed In
            </p>
            <p
              className="font-display text-lg font-bold mt-1"
              style={{ color: 'var(--color-espresso)' }}
            >
              {user?.restaurantName || user?.name || 'Owner'}
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: 'var(--color-muted)' }}
            >
              {user?.email || 'owner@example.com'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
