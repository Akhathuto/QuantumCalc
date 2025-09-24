import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  title?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', ariaLabel, title }) => {
  const baseClasses = "flex items-center justify-center h-16 rounded-lg text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface transition-transform transform active:scale-95";
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`} aria-label={ariaLabel || (typeof children === 'string' ? children : '')} title={title}>
      {children}
    </button>
  );
};

export default Button;