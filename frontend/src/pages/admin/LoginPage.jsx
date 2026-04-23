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

  /* ── Reusable animated field ───────────────────────────────── */
  const Field = ({ id, label, type, value, onChange, placeholder, extra }) => {
    const isFocused = focused === id;
    const hasValue  = value.length > 0;
    return (
      <div className="relative pt-5">
        {/* Floating label */}
        <label
          htmlFor={id}
          className="absolute font-semibold uppercase tracking-widest transition-all duration-200 pointer-events-none"
          style={{
            top:      isFocused || hasValue ? '0'      : '1.4rem',
            left:     '0',
            fontSize: isFocused || hasValue ? '10px'   : '14px',
            color:    isFocused ? 'var(--gold, #C9A84C)' : 'var(--muted, #8C7B6B)',
          }}
        >
          {label}
        </label>

        <div className="relative">
          {/* ✅ name attribute added — this fixes the browser validation error */}
          <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={isFocused ? placeholder : ''}
            onFocus={() => setFocused(id)}
            onBlur={() => setFocused('')}
            required
            autoComplete={id === 'email' ? 'email' : 'current-password'}
            className="w-full bg-transparent border-0 border-b-2 outline-none py-2 pr-10 text-sm transition-colors duration-200"
            style={{
              borderBottomColor: isFocused
                ? 'var(--gold, #C9A84C)'
                : 'var(--divider, #E8D5B7)',
              color: 'var(--espresso, #2C1A0E)',
              fontFamily: 'var(--font-body, sans-serif)',
            }}
          />

          {/* Gold focus underline animation */}
          <div
            className="absolute bottom-0 left-0 h-0.5 transition-all duration-300"
            style={{
              width:      isFocused ? '100%' : '0%',
              background: 'var(--gold, #C9A84C)',
            }}
          />

          {/* Extra slot — used for show/hide password toggle */}
          {extra}
        </div>
      </div>
    );
  };

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'var(--primary-dark, #5C0E0E)' }}
    >
      {/* Background radial glow — top left */}
      <div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 0%, rgba(201,168,76,0.12) 0%, transparent 60%)',
          opacity: 1,
        }}
      />
      {/* Background radial glow — bottom right */}
      <div
        className="absolute bottom-0 right-0 w-80 h-80 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 80% 100%, rgba(201,168,76,0.07) 0%, transparent 60%)',
        }}
      />

      {/* Card wrapper */}
      <div className="w-full max-w-md relative z-10" style={{ animation: 'fadeUp 0.5s ease both' }}>
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background:  'var(--white, #FFFFFF)',
            boxShadow:   '0 16px 56px rgba(44,26,14,0.35)',
          }}
        >

          {/* ── Card header ──────────────────────────────── */}
          <div
            className="px-8 py-8 text-center"
            style={{
              background:
                'linear-gradient(135deg, #5C0E0E 0%, #8B1A1A 100%)',
            }}
          >
            {/* Logo */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
              style={{
                background:  'rgba(201,168,76,0.18)',
                border:      '2px solid #C9A84C',
                animation:   'bounceIn 0.6s ease both',
              }}
            >
              🍽️
            </div>

            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: 'var(--font-display, "Playfair Display", serif)',
                color:      '#C9A84C',
              }}
            >
              Admin Portal
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: 'rgba(253,246,236,0.75)' }}
            >
              Sign in to manage your restaurant
            </p>
          </div>

          {/* ── Form body ────────────────────────────────── */}
          <div className="px-8 py-8">

            {/* Error banner */}
            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm"
                style={{
                  background: '#FEE2E2',
                  color:      '#991B1B',
                  animation:  'fadeDown 0.3s ease both',
                }}
              >
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate={false} className="space-y-6">

              {/* Email */}
              <Field
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@restaurant.com"
              />

              {/* Password */}
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
                    className="absolute right-0 bottom-2 text-base transition-opacity hover:opacity-70"
                    style={{ color: 'var(--muted, #8C7B6B)' }}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPw ? '🙈' : '👁️'}
                  </button>
                }
              />

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-base font-semibold flex items-center justify-center gap-2 transition-all duration-200 mt-4"
                style={{
                  borderRadius:    '14px',
                  background:      loading ? '#B94040' : '#8B1A1A',
                  color:           '#E8C97A',
                  fontFamily:      'var(--font-display, "Playfair Display", serif)',
                  boxShadow:       '0 6px 22px rgba(139,26,26,0.35)',
                  transform:       loading ? 'scale(0.98)' : 'scale(1)',
                  cursor:          loading ? 'not-allowed' : 'pointer',
                  border:          'none',
                  opacity:         loading ? 0.8 : 1,
                }}
              >
                {loading ? (
                  <>
                    {/* Inline spinner */}
                    <span
                      style={{
                        display:     'inline-block',
                        width:       '18px',
                        height:      '18px',
                        border:      '2.5px solid rgba(232,201,122,0.4)',
                        borderTopColor: '#E8C97A',
                        borderRadius: '50%',
                        animation:   'spin 0.75s linear infinite',
                        flexShrink:  0,
                      }}
                    />
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

            {/* Divider */}
            <div
              className="flex items-center gap-3 mt-6"
              style={{ opacity: 0.45 }}
            >
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #C9A84C, transparent)' }} />
              <span style={{ color: '#C9A84C', fontSize: '12px' }}>◆</span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #C9A84C, transparent)' }} />
            </div>

            {/* Footer */}
            <p
              className="text-center text-xs mt-4"
              style={{ color: 'var(--muted, #8C7B6B)' }}
            >
              New restaurant?{' '}
              <a
                href="mailto:support@qrmenu.com"
                className="underline transition hover:opacity-70"
                style={{ color: '#8B1A1A' }}
              >
                Contact support to register
              </a>
            </p>
          </div>
        </div>

        {/* Demo credentials hint */}
        <p
          className="text-center text-xs mt-4"
          style={{
            color:     'rgba(253,246,236,0.35)',
            animation: 'fadeUp 0.5s ease 0.3s both',
          }}
        >
          Demo: admin@digitaldiner.com · password123
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
