import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      startIcon,
      endIcon,
      fullWidth = false,
      className = '',
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputWrapperStyles = `relative flex items-center rounded-xl bg-banking-slate-900 border transition-all duration-200 ${
      error
        ? 'border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500'
        : 'border-banking-slate-700/80 focus-within:ring-2 focus-within:ring-banking-indigo-500/20 focus-within:border-banking-indigo-500'
    }`;

    const inputStyles = `w-full bg-transparent px-4 py-3 text-sm text-banking-slate-100 placeholder-banking-slate-500 outline-none disabled:opacity-50 ${
      startIcon ? 'pl-10' : ''
    } ${endIcon ? 'pr-10' : ''} ${className}`;

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <div className={`flex flex-col gap-1.5 ${widthStyles}`}>
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-banking-slate-300">
            {label}
          </label>
        )}
        <div className={inputWrapperStyles}>
          {startIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-banking-slate-500">
              {startIcon}
            </div>
          )}
          <input ref={ref} id={id} type={type} className={inputStyles} {...props} />
          {endIcon && (
            <div className="absolute right-3 flex items-center text-banking-slate-455">
              {endIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
