// src/components/PublicRoute.tsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';
import { LoadingSpinner } from './ui/LoadingSpinner';

export function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen/>
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}
