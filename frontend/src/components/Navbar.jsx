import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

function Navbar({ children }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg md:hidden"
      >
        ☰
      </button>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 md:hidden">
            <Sidebar />
          </div>
        </>
      )}

      <div className="hidden md:block fixed left-0 top-0">
        <Sidebar />
      </div>

      <div className="md:ml-64">
        <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.restaurantName}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">{user?.name}</span>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default Navbar;