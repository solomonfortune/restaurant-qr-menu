import React from 'react';

/**
 * GoldDivider Component
 * Decorative ornamental divider with horizontal lines, centered diamond/star
 * Used to separate menu sections and add visual interest
 */
const GoldDivider = ({ 
  className = '',
  style = {},
  variant = 'standard' 
}) => {
  return (
    <div 
      className={`flex items-center gap-3 my-6 ${className}`}
      style={style}
      aria-hidden="true"
    >
      {/* Left decorative line */}
      <div 
        className="flex-1 h-px"
        style={{ backgroundColor: 'var(--color-gold)', opacity: 0.4 }}
      />
      
      {/* Center ornament - SVG star */}
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16"
        style={{ color: 'var(--color-gold)', opacity: 0.8 }}
      >
        <polygon 
          points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" 
          fill="currentColor"
        />
      </svg>
      
      {/* Right decorative line */}
      <div 
        className="flex-1 h-px"
        style={{ backgroundColor: 'var(--color-gold)', opacity: 0.4 }}
      />
    </div>
  );
};

export default GoldDivider;
