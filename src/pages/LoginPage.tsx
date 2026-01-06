// src/pages/LoginPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { ApiError, authApi } from '../lib/api';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: () => authApi.login(email, password),
    onSuccess: (data) => {
      login(data.data.access_token);
      navigate('/');
    },
    onError: (error: ApiError) => {
      toast(error.message || 'Login failed');
    },
  });

  const handleSubmit = () => {
    if (!email || !password) {
      toast('Please fill in all fields');
      return;
    }
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Absensi WFH</h1>
          <p className="text-gray-600">Masuk ke akun Anda</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Perusahaan</label>
            <div className="relative">
              <svg
                className="absolute left-3 top-3 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                type="email"
                placeholder="nama@perusahaan.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loginMutation.isPending}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={loginMutation.isPending}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loginMutation.isPending}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? 'Loading...' : 'Masuk'}
          </button>
        </div>
      </div>
    </div>
  );
}
