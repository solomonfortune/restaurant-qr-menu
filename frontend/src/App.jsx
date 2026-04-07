import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MenuPage from './pages/customer/MenuPage';
import OrderSuccessPage from './pages/customer/OrderSuccessPage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import MenuManagementPage from './pages/admin/MenuManagementPage';
import CategoryPage from './pages/admin/CategoryPage';
import OrdersPage from './pages/admin/OrdersPage';
import TablesPage from './pages/admin/TablesPage';

const App = () => {
  return (
    <Routes>
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/admin/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/menu" element={<MenuManagementPage />} />
        <Route path="/admin/categories" element={<CategoryPage />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/tables" element={<TablesPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default App;
