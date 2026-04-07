import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ title, subtitle, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="admin-shell min-h-screen bg-stone-100 lg:pl-72">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={logout} />
      <div className="min-h-screen">
        <Navbar title={title} subtitle={subtitle} user={user} onMenuToggle={() => setSidebarOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
