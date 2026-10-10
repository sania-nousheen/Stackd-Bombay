import React from 'react';

interface StackdLogoProps {
  className?: string;
  color?: string; // e.g. '#F5F0E5' (warm ivory) or '#6C1929' (burgundy)
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
}

/**
 * Stackd Bombay Official Brand Logo
 * 
 * - "Stackd": Authentic calligraphic cursive flourish logo font (Alex Brush / cursive)
 * - "BOMBAY": Small, clean, widely spaced uppercase lettering
 * - Perfectly balanced, centered, and responsive across all breakpoints
 */
export const StackdLogo: React.FC<StackdLogoProps> = ({
  className = '',
  color = '#F5F0E5',
  size = 'md'
}) => {
  const sizeConfig = {
    sm: {
      fontSize: '2.2rem',
      bombaySize: '0.52rem',
      bombaySpacing: '0.34em',
      bombayMargin: '-0.2rem'
    },
    md: {
      fontSize: '3.1rem',
      bombaySize: '0.62rem',
      bombaySpacing: '0.36em',
      bombayMargin: '-0.28rem'
    },
    lg: {
      fontSize: '4.3rem',
      bombaySize: '0.82rem',
      bombaySpacing: '0.40em',
      bombayMargin: '-0.38rem'
    },
    xl: {
      fontSize: '5.6rem',
      bombaySize: '0.96rem',
      bombaySpacing: '0.44em',
      bombayMargin: '-0.48rem'
    },
    hero: {
      fontSize: 'clamp(4.2rem, 13vw, 7.2rem)',
      bombaySize: 'clamp(0.85rem, 2.2vw, 1.25rem)',
      bombaySpacing: '0.46em',
      bombayMargin: '-0.6rem'
    }
  }[size];

  return (
    <div className={`inline-flex flex-col items-center select-none text-center ${className}`}>
      {/* Brand Name "Stackd" in Authentic Calligraphic Script Logo Font */}
      <span
        className="font-['Alex_Brush',cursive] leading-none inline-block select-none"
        style={{
          color,
          fontSize: sizeConfig.fontSize,
          letterSpacing: '-0.01em',
          transform: 'translateY(2%)'
        }}
      >
        Stackd
      </span>

      {/* Widely Spaced Small Uppercase "BOMBAY" */}
      <span
        className="font-['Plus_Jakarta_Sans',sans-serif] font-bold uppercase text-center w-full select-none"
        style={{
          color,
          fontSize: sizeConfig.bombaySize,
          letterSpacing: sizeConfig.bombaySpacing,
          marginTop: sizeConfig.bombayMargin,
          opacity: 0.95,
          paddingLeft: sizeConfig.bombaySpacing // balances trailing letterSpacing to keep it mathematically centered
        }}
      >
        BOMBAY
      </span>
    </div>
  );
};
