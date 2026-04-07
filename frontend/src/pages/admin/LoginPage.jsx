import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    restaurantName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form);
      }

      const redirectTo = location.state?.from?.pathname || '/admin/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(232,93,36,0.2),transparent_32%),linear-gradient(135deg,#FFF8F0,#ffffff)] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[36px] bg-white shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden bg-stone-950 p-10 text-white lg:block">
          <p className="text-xs uppercase tracking-[0.4em] text-orange-300">Restaurant Tech</p>
          <h1 className="mt-4 font-display text-5xl leading-tight">Serve menus, tables, and live orders from one QR flow.</h1>
          <p className="mt-4 max-w-md text-stone-300">This admin portal gives restaurant owners a cleaner way to manage dishes, print QR codes, and keep the kitchen synced.</p>
        </section>

        <section className="p-6 sm:p-10">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.4em] text-brand">Admin Access</p>
            <h2 className="mt-3 font-display text-4xl text-stone-900">{mode === 'login' ? 'Welcome Back' : 'Create Restaurant Account'}</h2>
            <p className="mt-2 text-sm text-stone-500">{mode === 'login' ? 'Sign in to manage your menu and orders.' : 'Set up your restaurant and start generating QR menus.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-brand" />
                <input name="restaurantName" value={form.restaurantName} onChange={handleChange} placeholder="Restaurant name" required className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-brand" />
              </>
            )}
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email address" required className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-brand" />
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required minLength="6" className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-brand" />

            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-brand px-4 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:bg-stone-300">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between gap-4 text-sm text-stone-500">
            <button type="button" onClick={() => setMode((current) => current === 'login' ? 'register' : 'login')} className="font-semibold text-brand">
              {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
            <Link to="/menu" className="font-semibold text-stone-700">Open Customer Menu</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
