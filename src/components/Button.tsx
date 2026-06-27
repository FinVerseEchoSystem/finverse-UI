import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-gradient-to-r from-banking-indigo-600 to-banking-indigo-700 hover:from-banking-indigo-500 hover:to-banking-indigo-600 text-white shadow-lg shadow-banking-indigo-900/20 focus:ring-banking-indigo-500 border border-banking-indigo-600/20',
    secondary: 'bg-banking-slate-800 hover:bg-banking-slate-700 text-banking-slate-100 border border-banking-slate-700/50 focus:ring-banking-slate-500',
    outline: 'bg-transparent border border-banking-slate-700 hover:bg-banking-slate-800 text-banking-slate-200 focus:ring-banking-slate-500',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/20 focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-banking-slate-800/50 text-banking-slate-300 hover:text-banking-slate-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
