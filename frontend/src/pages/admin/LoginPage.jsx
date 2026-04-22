import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function LoginPage() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [focused,  setFocused]  = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Invalid email or password.');
    }
    setLoading(false);
  };

  /* Reusable field component */
  const Field = ({ id, label, type, value, onChange, placeholder, extra }) => {
    const isFocused = focused === id;
    const hasValue  = value.length > 0;
    return (
      <div className="relative pt-5">
        <label
          htmlFor={id}
          className="absolute text-xs font-semibold uppercase tracking-widest transition-all duration-200"
          style={{
            top:   isFocused || hasValue ? '0' : '1.4rem',
            left:  '0',
            color: isFocused ? 'var(--color-gold)' : 'var(--color-muted)',
            fontSize: isFocused || hasValue ? '10px' : '14px',
          }}
        >
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={isFocused ? placeholder : ''}
            onFocus={() => setFocused(id)}
            onBlur={() => setFocused('')}
            required
            className="input-restaurant w-full pr-10"
          />
          {/* Animated focus bar */}
          <div
            className="absolute bottom-0 left-0 h-0.5 transition-all duration-300"
            style={{
              width: isFocused ? '100%' : '0%',
              background: 'var(--color-gold)',
            }}
          />
          {extra}
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--color-espresso)' }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 left-0 right-0 h-64 opacity-10"
        style={{
          background:
            'radial-gradient(ellipse at 30% 0%, var(--color-gold) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="w-full max-w-md animate-fade-up"
        style={{ animationDelay: '0.1s' }}
      >
        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'var(--color-white)',
            boxShadow: 'var(--shadow-float)',
          }}
        >
          {/* Card header band */}
          <div
            className="px-8 py-8 text-center"
            style={{
              background:
                'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
            }}
          >
            {/* Logo icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce-in"
              style={{ background: 'rgba(201,168,76,0.2)', border: '2px solid var(--color-gold)' }}
            >
              🍽️
            </div>
            <h1
              className="font-display text-2xl font-bold"
              style={{ color: 'var(--color-gold)' }}
            >
              Admin Portal
            </h1>
            <p
              className="text-sm mt-1 opacity-75"
              style={{ color: 'var(--color-cream)' }}
            >
              Sign in to manage your restaurant
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {/* Error banner */}
            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm animate-fade-down"
                style={{ background: '#FEE2E2', color: '#991B1B' }}
              >
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <Field
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@restaurant.com"
              />

              {/* Password field */}
              <Field
                id="password"
                label="Password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                extra={
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-0 bottom-2.5 text-sm transition hover:opacity-70"
                    style={{ color: 'var(--color-muted)' }}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? '🙈' : '👁️'}
                  </button>
                }
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 focus-gold"
                style={{ borderRadius: '14px', marginTop: '2rem' }}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: '18px', height: '18px', borderColor: 'var(--color-gold-light)', borderTopColor: 'transparent' }} />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>🔑</span>
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer note */}
            <div
              className="gold-divider mt-6"
              style={{ opacity: 0.5 }}
            >
              <span className="gold-divider-icon text-xs">◆</span>
            </div>
            <p
              className="text-center text-xs mt-4"
              style={{ color: 'var(--color-muted)' }}
            >
              New restaurant?{' '}
              <a
                href="mailto:support@qrmenu.com"
                className="underline transition hover:opacity-70"
                style={{ color: 'var(--color-primary)' }}
              >
                Contact support to register
              </a>
            </p>
          </div>
        </div>

        {/* Test credentials hint (remove in production) */}
        <p
          className="text-center text-xs mt-4 animate-fade-up stagger-3"
          style={{ color: 'rgba(253,246,236,0.4)' }}
        >
          Demo: admin@digitaldiner.com · password123
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
