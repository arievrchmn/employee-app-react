import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  success: 'bg-green-600 text-white hover:bg-green-700',
  warning: 'bg-orange-600 text-white hover:bg-orange-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  secondary: 'bg-gray-500 text-white hover:bg-gray-600',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  loadingText = 'Loading...',
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses =
    'font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const widthClass = fullWidth ? 'w-full' : '';
  const iconGapClass = leftIcon || rightIcon ? 'flex items-center gap-2' : '';

  const allClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    iconGapClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={allClasses} disabled={disabled || isLoading} {...props}>
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{isLoading ? loadingText : children}</span>
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};