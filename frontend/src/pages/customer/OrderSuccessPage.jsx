import { Link, useSearchParams } from 'react-router-dom';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const table = searchParams.get('table');
  const owner = searchParams.get('owner');

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(232,93,36,0.18),transparent_35%),#FFF8F0] px-4">
      <div className="checkmark-circle w-full max-w-lg rounded-[32px] bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-green-50">
          <svg viewBox="0 0 52 52" className="h-20 w-20" fill="none">
            <circle cx="26" cy="26" r="24" stroke="#22C55E" strokeWidth="2" />
            <path className="checkmark-path" d="M14 27l8 8 16-18" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-brand">Order Confirmed</p>
        <h1 className="mt-3 font-display text-4xl text-stone-900">Your order has been received!</h1>
        <p className="mt-3 text-stone-500">The kitchen has your request and will start preparing it shortly for table {table || '--'}.</p>
        <Link to={`/menu?table=${table || ''}&owner=${owner || ''}`} className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white">
          Back To Menu
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
