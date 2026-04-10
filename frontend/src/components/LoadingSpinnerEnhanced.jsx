import React from 'react';

/**
 * LoadingSpinner Component - Luxury Bistro Theme
 * Enhanced with smooth animations and bistro color palette
 */

const LoadingSpinner = ({ size = 'md', color = 'primary', fullScreen = false }) => {
  const sizeMap = {
    sm: '24px',
    md: '40px',
    lg: '60px',
  };

  const colorMap = {
    primary: 'var(--color-primary)',
    accent: 'var(--color-accent)',
    white: '#FFFFFF',
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;
  const spinnerColor = colorMap[color] || colorMap.primary;

  const spinnerStyle = {
    width: spinnerSize,
    height: spinnerSize,
    border: `3px solid ${spinnerColor}25`,
    borderTop: `3px solid ${spinnerColor}`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  };

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(2px)',
        }}
      >
        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: 'var(--color-cream)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={spinnerStyle} />
          <p
            className="mt-4 text-sm font-semibold text-center"
            style={{ color: 'var(--color-muted)' }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return <div style={spinnerStyle} />;
};

export default LoadingSpinner;
