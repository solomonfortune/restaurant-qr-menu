import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tableNumber, setTableNumber] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setTableNumber(params.get('table'));
  }, [location]);

  const handleBack = () => {
    if (tableNumber) {
      navigate(`/menu?table=${tableNumber}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              className="animate-checkmark"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-dark mb-2">Order Placed!</h1>
        <p className="text-gray-600 mb-6">Your order has been received and is being prepared.</p>
        {tableNumber && (
          <p className="text-gray-500 mb-8">Table {tableNumber}</p>
        )}
        <button
          onClick={handleBack}
          className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}

export default OrderSuccessPage;