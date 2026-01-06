/* eslint-disable @typescript-eslint/no-explicit-any */

// src/App.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { AttendancePage } from './pages/AttendancePage';
import { SummaryPage } from './pages/SummaryPage';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
    mutations: {
      onError: (error: any) => {
        if (error.status === 401) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
      },
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProfilePage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="summary" element={<SummaryPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-center" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
