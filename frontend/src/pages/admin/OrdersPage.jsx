import { useEffect, useState, useRef } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import OrderCard from '../../components/OrderCard';
import LoadingSpinner from '../../components/LoadingSpinner';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);
  const lastPendingCount = useRef(0);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      const newOrders = response.data.orders;
      
      const pendingCount = newOrders.filter(o => o.status === 'pending').length;
      if (pendingCount > lastPendingCount.current) {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }
      lastPendingCount.current = pendingCount;
      
      setOrders(newOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const groupedOrders = {
    pending: orders.filter(o => o.status === 'pending'),
    confirmed: orders.filter(o => o.status === 'confirmed'),
    preparing: orders.filter(o => o.status === 'preparing'),
    ready: orders.filter(o => o.status === 'ready'),
    completed: orders.filter(o => o.status === 'completed'),
    cancelled: orders.filter(o => o.status === 'cancelled')
  };

  const statusGroups = [
    { key: 'pending', label: 'Pending', color: 'border-yellow-400' },
    { key: 'confirmed', label: 'Confirmed', color: 'border-blue-400' },
    { key: 'preparing', label: 'Preparing', color: 'border-orange-400' },
    { key: 'ready', label: 'Ready', color: 'border-green-400' }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Navbar>
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRYGPaDTrX8bBD6d06mAHgM8o9GpgR4BO6PPqIIfADqfyqeEIQE2oMinhCMBMpu/p4cjAjCYv6eIJAMwlr+nhSQFNJe/pocmBzGWv6eIJgc0mL+niCYINZm/p4gnCDaZv6eIJwk3mb+niCcJNpq/pognCjeav6eIJwo4mr+niCcKOZq/p4gnCjqav6eIJwo7mr+niCcKO5q/p4gnCjuav6eIJwo8mr+niCcKPJq/p4gnCj2av6eIJwpAmr+niCcKQZq/p4gnCkKav6eIJwpDmr+niCcKRJq/p4gnCkmav6eIJwpJmr+niCcKS5q/p4gnCkyav6eIJwpNmr+niCcKTpq/p4gnClCav6eIJwpSmr+niCcKU5q/p4gnClSav6eIJwpbmr+niCcKXpq/p4gnCmCav6eIJwrimr+niCcKaJq/p4gnCmuav6eIJwptmr+niCcKb5q/p4gnCnGav6eIJwp0mr+niCcKeJq/p4gnCoCav6eIJwqGmr+niCcKipq/p4gnCo+av6eIJwqSmr+niCcKlJq/p4gnCpiav6eIJwqamr+niCcKnZq/p4gnCqGav6eIJwqmmr+niCcKrJq/p4gnCrSqv6eIJwq2mr+niCcKvJq/p4gnCsCav6eIJwrGmr+niCcKzJq/p4gnCsyav6eIJwrOmr+niCcK0pq/p4gnCtiav6eIJwramr+niCcK45q/p4gnCueav6eIJwrqmr+niCcK7Jq/p4gnCu+af6eIJwrymr+niCcK9pq/p4gnCvman6eIJwr+mp+niCcK/Jqfp4gnCwCao6eIJwsGmqOniCcLCpqjp4gnCxKap6eIJwsOmp+niCcLFpqjp4gnCyKap6eIJwsimqOjiCcLNpqjp4gnCzqaq6OIJwtCmqOjiCcLVpqjo4gnC16ao6OIJwtmmqOjiCcLbJqjo4gnC3iao6OIJwt2mp+jiCcLfJqfp4gnC4Kao6OIHwuGmp+jiB8Lkpqfp4gfC5qao6OIHwuemqOjiB8Lppqfp4gfC6qao6OIHwu2mp+jiB8Ltpqfo4gfC7aan6OIHwuumqOjiB8Ltpqfo4gfC76ao6OIHwu+mp+jiB8LxJqfo4gfC8yap6OIHwvQmqOjiB8L1Jqjp4gfC9ial6OIHwvamqOjiB8L3JqXo4gfC9yaliOIH0vcmpcjiB9L3JqWJIgfS9yalSSIH0vgmpUkiB9L4JqVJYgfS+SalSU=" />
      
      <h1 className="text-2xl font-bold mb-6">Live Orders</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {statusGroups.map(group => (
          <div key={group.key} className={`bg-white rounded-xl shadow-sm p-4 border-t-4 ${group.color}`}>
            <h2 className="font-bold mb-4">
              {group.label} ({groupedOrders[group.key].length})
            </h2>
            <div className="space-y-4">
              {groupedOrders[group.key].length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No orders</p>
              ) : (
                groupedOrders[group.key].map(order => (
                  <OrderCard key={order._id} order={order} onUpdate={fetchOrders} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </Navbar>
  );
}

export default OrdersPage;