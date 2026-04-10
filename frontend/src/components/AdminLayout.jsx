import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

/**
 * AdminLayout Component
 * Flexbox layout with sidebar (left) and main content (right)
 * Sidebar collapses to drawer on mobile
 */
const AdminLayout = ({ title, subtitle, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('admin-dark-mode') === 'true'
  );
  const { user, logout } = useAuth();

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem('admin-dark-mode', newValue.toString());
      if (newValue) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      return newValue;
    });
  };

  // Apply dark mode on mount
  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={logout}
      />
      
      <div className="min-h-screen flex-1 lg:ml-60">
        <Navbar
          title={title}
          subtitle={subtitle}
          user={user}
          onMenuToggle={() => setSidebarOpen(true)}
          darkMode={darkMode}
          onDarkModeToggle={handleDarkModeToggle}
        />
        <main className="px-4 py-6 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-cream)' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
