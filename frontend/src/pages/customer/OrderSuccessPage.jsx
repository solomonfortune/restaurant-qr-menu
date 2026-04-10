import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import GoldDivider from '../../components/GoldDivider';

/**
 * OrderSuccessPage Component
 * Displays animated success confirmation with order details
 */
const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const table = searchParams.get('table');
  const owner = searchParams.get('owner');

  useEffect(() => {
    // Play success sound
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Two-tone chime
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('Audio context not supported');
    }
  }, []);

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-8"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-8 text-center"
        style={{
          backgroundColor: 'var(--color-white)',
          boxShadow: 'var(--shadow-float)',
          animation: 'fadeUp 0.6s ease-out',
        }}
      >
        {/* Animated Checkmark */}
        <div
          className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full"
          style={{
            backgroundColor: '#DCFCE7',
            animation: 'popIn 0.6s ease-out',
          }}
        >
          <svg
            viewBox="0 0 52 52"
            className="h-24 w-24"
            fill="none"
            style={{
              animation: 'fadeUp 0.4s ease-out 0.2s both',
            }}
          >
            <circle
              cx="26"
              cy="26"
              r="24"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeDasharray="150.8"
              strokeDashoffset="150.8"
              style={{
                animation: 'drawCircle 0.6s ease-out 0.2s forwards',
              }}
            />
            <path
              d="M14 27l8 8 16-18"
              stroke="var(--color-primary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="48"
              strokeDashoffset="48"
              style={{
                animation: 'drawCheck 0.6s ease-out 0.4s forwards',
              }}
            />
          </svg>
        </div>

        {/* Header */}
        <p
          className="text-xs uppercase tracking-widest font-semibold mb-2"
          style={{ color: 'var(--color-gold)' }}
        >
          ✓ Order Confirmed
        </p>

        <h1
          className="font-display text-4xl font-bold mb-3"
          style={{
            color: 'var(--color-espresso)',
            animation: 'fadeUp 0.6s ease-out 0.1s both',
          }}
        >
          Your Order Has Been Received!
        </h1>

        <GoldDivider />

        {/* Message */}
        <p
          className="text-lg mb-8"
          style={{
            color: 'var(--color-charcoal)',
            animation: 'fadeUp 0.6s ease-out 0.2s both',
          }}
        >
          The kitchen has received your order and will start preparing it with care.
        </p>

        {/* Order Summary Card */}
        <div
          className="rounded-xl p-6 mb-8 space-y-4"
          style={{
            backgroundColor: 'var(--color-cream-dark)',
            borderLeft: '4px solid var(--color-gold)',
            animation: 'fadeUp 0.6s ease-out 0.3s both',
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--color-muted)' }}>📍 Table</span>
            <span
              className="font-display text-lg font-bold"
              style={{ color: 'var(--color-espresso)' }}
            >
              {table || '--'}
            </span>
          </div>

          <div
            className="h-px"
            style={{ backgroundColor: 'var(--color-divider)' }}
          />

          <div>
            <p
              className="text-xs uppercase tracking-wider font-semibold mb-2"
              style={{ color: 'var(--color-muted)' }}
            >
              ⏱ Estimated Preparation Time
            </p>
            <p
              className="font-display text-2xl font-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              ~20 minutes
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p
          className="text-base mb-8 italic"
          style={{
            color: 'var(--color-charcoal)',
            fontFamily: 'var(--font-accent)',
            animation: 'fadeUp 0.6s ease-out 0.4s both',
          }}
        >
          Sit back, relax, and watch for our staff to deliver your order. Thank you for choosing us!
        </p>

        {/* Back to Menu Button */}
        <Link
          to={`/menu?table=${table || ''}&owner=${owner || ''}`}
          className="inline-flex px-8 py-4 rounded-xl text-lg font-semibold transition hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-gold)',
            animation: 'fadeUp 0.6s ease-out 0.5s both',
          }}
        >
          ← Back to Menu
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
