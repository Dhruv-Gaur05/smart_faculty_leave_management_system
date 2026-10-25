import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  let variantStyles = 'bg-blue-900 hover:bg-blue-950 text-white border-transparent';

  if (variant === 'secondary') {
    variantStyles = 'bg-slate-700 hover:bg-slate-800 text-white border-transparent';
  } else if (variant === 'danger') {
    variantStyles = 'bg-rose-800 hover:bg-rose-900 text-white border-transparent';
  } else if (variant === 'outline') {
    variantStyles = 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300';
  }

  let sizeStyles = 'px-4 py-2 text-sm';
  if (size === 'sm') {
    sizeStyles = 'px-3 py-1.5 text-xs';
  } else if (size === 'lg') {
    sizeStyles = 'px-5 py-2.5 text-base';
  }

  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-none border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
