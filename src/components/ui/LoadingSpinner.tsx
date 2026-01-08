// src/components/ui/LoadingSpinner.tsx

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner = ({size = 'medium',fullScreen = false,className = ''}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  const containerClasses = fullScreen
    ? 'flex items-center justify-center min-h-screen'
    : 'flex items-center justify-center h-64';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div
        className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};