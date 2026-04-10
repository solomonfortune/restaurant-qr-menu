import React, { useEffect, useState } from 'react';

/**
 * Toast Component
 * Beautiful notification system for feedback messages
 * Features: auto-dismiss, different types (success, error, warning, info)
 */

const toastTypeConfig = {
  success: {
    icon: '✓',
    backgroundColor: '#DCFCE7',
    textColor: '#166534',
    borderColor: '#86EFAC',
  },
  error: {
    icon: '✕',
    backgroundColor: '#FEE2E2',
    textColor: '#991B1B',
    borderColor: '#FCA5A5',
  },
  warning: {
    icon: '⚠',
    backgroundColor: '#FEF3C7',
    textColor: '#92400E',
    borderColor: '#FCD34D',
  },
  info: {
    icon: 'ℹ',
    backgroundColor: '#DBEAFE',
    textColor: '#1E40AF',
    borderColor: '#93C5FD',
  },
};

const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const config = toastTypeConfig[type] || toastTypeConfig.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className="rounded-lg px-4 py-3 shadow-lg border-l-4 flex items-center gap-3"
      style={{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
        borderColor: config.borderColor,
        animation: isExiting
          ? 'toastSlideOut 0.3s cubic-bezier(0.25,0.46,0.45,0.94) forwards'
          : 'toastSlideIn 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
    >
      <span className="text-lg font-bold">{config.icon}</span>
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onClose, 300);
        }}
        className="text-lg opacity-60 hover:opacity-100 transition"
        style={{ color: config.textColor }}
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
