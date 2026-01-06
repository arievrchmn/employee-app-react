// src/lib/api.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('access_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'An error occurred');
  }

  return data;
}

// Auth APIs
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// Staff Profile APIs
export const staffApi = {
  getProfile: () =>
    fetchApi<{
      name: string;
      email: string;
      position: string;
      phone: string;
      photo_url: string;
    }>('/staff/profile'),

  updateProfile: (data: { phone?: string; password?: string }) =>
    fetchApi<null>('/staff/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Attendance APIs
export const attendanceApi = {
  getToday: () =>
    fetchApi<{
      attendance: {
        id: number;
        date: string;
        check_in: string | null;
        check_out: string | null;
      } | null;
      can_check_in: boolean;
      can_check_out: boolean;
    }>('/staff/attendance/today'),

  checkIn: () =>
    fetchApi<{
      id: number;
      date: string;
      check_in: string;
      check_out: string | null;
    }>('/staff/attendance/check-in', { method: 'POST' }),

  checkOut: () =>
    fetchApi<{
      id: number;
      date: string;
      check_in: string;
      check_out: string;
    }>('/staff/attendance/check-out', { method: 'POST' }),

  getSummary: (params: { page: number; limit: number; start_date: string; end_date: string }) => {
    const query = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      start_date: params.start_date,
      end_date: params.end_date,
    });
    return fetchApi<
      Array<{
        id: number;
        date: string;
        check_in: string;
        check_out: string | null;
      }>
    >(`/staff/attendance/summary?${query}`);
  },
};
