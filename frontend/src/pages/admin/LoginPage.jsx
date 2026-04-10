import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * LoginPage Component
 * Luxury bistro editorial gastronomy admin login
 * Design inspired by premium restaurant portals
 */

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
  const [showPassword, setShowPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(false);
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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background: 'linear-gradient(135deg, #FDF6EC 0%, #F5E6D0 50%, #FDF6EC 100%)',
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          {/* Fork & Spoon Icon */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Fork */}
              <path d="M3 2v6c0 1 .5 2 1.5 2.5M3 8h3m5-6v6c0 1-.5 2-1.5 2.5M10 8h3m4 6h2v8m-2-8l2 2m0 0l2-2" />
              {/* Spoon */}
              <path d="M18 2c0 2 1 4 2.5 5s2.5 1 2.5 3v6m-5 0h5" />
            </svg>
          </div>

          {/* Restaurant Name */}
          <h1
            className="font-display text-4xl sm:text-5xl font-bold mb-2"
            style={{ color: 'var(--color-espresso)' }}
          >
            {mode === 'login' ? 'Luwombo Palace' : 'Your Restaurant'}
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg sm:text-xl font-medium"
            style={{ color: 'var(--color-muted)' }}
          >
            {mode === 'login' ? 'Editorial Gastronomy Admin' : 'Join the Editorial Collection'}
          </p>
        </div>

        {/* Main Card */}
        <div
          className="rounded-3xl p-8 shadow-xl mb-8"
          style={{
            backgroundColor: 'var(--color-cream)',
            border: '1px solid rgba(201, 168, 76, 0.1)',
          }}
        >
          {/* Welcome Message */}
          {mode === 'login' && (
            <div className="mb-8">
              <h2
                className="font-display text-3xl font-bold mb-2"
                style={{ color: 'var(--color-espresso)' }}
              >
                Welcome Back
              </h2>
              <p
                className="text-base"
                style={{ color: 'var(--color-charcoal)' }}
              >
                Manage your restaurant operations with precision.
              </p>
            </div>
          )}

          {mode === 'register' && (
            <div className="mb-6">
              <h2
                className="font-display text-2xl font-bold mb-1"
                style={{ color: 'var(--color-espresso)' }}
              >
                Create Your Restaurant Account
              </h2>
              <p
                className="text-sm"
                style={{ color: 'var(--color-muted)' }}
              >
                Join the Editorial collection today
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Register Only Fields */}
            {mode === 'register' && (
              <>
                <div>
                  <label
                    className="block text-xs uppercase tracking-wider font-semibold mb-2"
                    style={{ color: 'var(--color-charcoal)' }}
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-3 rounded-xl border-b-2 focus:outline-none transition-all"
                    style={{
                      borderColor: 'transparent',
                      borderBottomColor: 'var(--color-accent)',
                      backgroundColor: 'var(--color-white)',
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-xs uppercase tracking-wider font-semibold mb-2"
                    style={{ color: 'var(--color-charcoal)' }}
                  >
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={form.restaurantName}
                    onChange={handleChange}
                    placeholder="Enter restaurant name"
                    required
                    className="w-full px-4 py-3 rounded-xl border-b-2 focus:outline-none transition-all"
                    style={{
                      borderColor: 'transparent',
                      borderBottomColor: 'var(--color-accent)',
                      backgroundColor: 'var(--color-white)',
                    }}
                  />
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label
                className="block text-xs uppercase tracking-wider font-semibold mb-2"
                style={{ color: 'var(--color-charcoal)' }}
              >
                Owner Email
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl"
                >
                  @
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="owner@luwombopalace.ug"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-b-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'transparent',
                    borderBottomColor: 'var(--color-accent)',
                    backgroundColor: 'var(--color-white)',
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="block text-xs uppercase tracking-wider font-semibold"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Secure Key
                </label>
                {mode === 'login' && (
                  <Link
                    to="#"
                    className="text-xs font-semibold transition"
                    style={{ color: '#DC2626' }}
                  >
                    Forgot Access?
                  </Link>
                )}
              </div>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl"
                >
                  🔒
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength="6"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border-b-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'transparent',
                    borderBottomColor: 'var(--color-accent)',
                    backgroundColor: 'var(--color-white)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl transition opacity-70 hover:opacity-100"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Stay Signed In Checkbox */}
            {mode === 'login' && (
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={staySignedIn}
                  onChange={(e) => setStaySignedIn(e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
                <span
                  className="text-base font-medium"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Stay signed in for 30 days
                </span>
              </label>
            )}

            {/* Error Message */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm font-medium"
                style={{
                  backgroundColor: '#FEE2E2',
                  color: '#991B1B',
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full font-bold text-lg text-white transition-all transform hover:scale-105 disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-3"
              style={{
                backgroundColor: 'var(--color-primary)',
              }}
            >
              {loading ? (
                <>
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"
                  />
                  ENTERING DASHBOARD
                </>
              ) : (
                <>
                  {mode === 'login' ? 'ENTERING DASHBOARD' : 'CREATE ACCOUNT'}
                </>
              )}
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-6 text-center">
            <p
              className="text-sm mb-2"
              style={{ color: 'var(--color-muted)' }}
            >
              {mode === 'login'
                ? "New to the Editorial collection?"
                : 'Already have an account?'}
            </p>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
                setForm({ name: '', restaurantName: '', email: '', password: '' });
              }}
              className="text-base font-bold transition flex items-center justify-center gap-2"
              style={{ color: 'var(--color-primary)' }}
            >
              {mode === 'login' ? (
                <>
                  Register your Restaurant
                  <span>→</span>
                </>
              ) : (
                'Back to Login'
              )}
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div
          className="flex justify-around text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--color-charcoal)' }}
        >
          <Link to="#" className="transition hover:opacity-70">
            System Status
          </Link>
          <Link to="#" className="transition hover:opacity-70">
            Privacy Protocol
          </Link>
          <Link to="#" className="transition hover:opacity-70">
            Contact Concierge
          </Link>
        </div>

        {/* Customer Menu Link */}
        <div className="mt-6 text-center">
          <Link
            to="/menu"
            className="text-sm font-semibold transition"
            style={{ color: 'var(--color-primary)' }}
          >
            ← Customer Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
