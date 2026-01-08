// src/pages/AttendancePage.tsx

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, attendanceApi } from '../lib/api';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

dayjs.extend(utc);
dayjs.extend(timezone);

export function AttendancePage() {
  const queryClient = useQueryClient();

  const { data: todayData, isLoading } = useQuery({
    queryKey: ['attendance-today'],
    queryFn: () => attendanceApi.getToday(),
    refetchInterval: 30000,
  });

  const checkInMutation = useMutation({
    mutationFn: () => attendanceApi.checkIn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-summary'] });
      toast('Check-in berhasil!');
    },
    onError: (error: ApiError) => {
      toast(error.message || 'Check-in gagal');
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: () => attendanceApi.checkOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-summary'] });
      toast('Check-out berhasil!');
    },
    onError: (error: ApiError) => {
      toast(error.message || 'Check-out gagal');
    },
  });

  const handleAttendance = () => {
    if (todayData?.data.can_check_in) {
      checkInMutation.mutate();
    } else if (todayData?.data.can_check_out) {
      checkOutMutation.mutate();
    }
  };

  if (isLoading) {
    return <LoadingSpinner />
  }

  const canCheckIn = todayData?.data.can_check_in;
  const canCheckOut = todayData?.data.can_check_out;
  const attendance = todayData?.data.attendance;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Absensi Hari Ini</h2>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="text-center">
            <svg
              className="mx-auto text-indigo-600 mb-3 w-12 h-12"
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
            <p className="text-gray-600 mb-2">Tanggal</p>
            <p className="text-2xl font-bold text-gray-800 mb-4">
              {dayjs().format('dddd, DD MMMM YYYY')}
            </p>
            <p className="text-gray-600 mb-2">Waktu Sekarang</p>
            <p className="text-3xl font-bold text-indigo-600">{dayjs().format('HH:mm:ss')}</p>
          </div>
        </div>

        {attendance && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-blue-800 mb-2">Status Absensi Hari Ini:</p>
            <div className="space-y-1">
              {attendance.check_in && (
                <p className="text-sm text-blue-700">
                  ✓ Check-in: {dayjs(attendance.check_in).format('HH:mm:ss')}
                </p>
              )}
              {attendance.check_out && (
                <p className="text-sm text-blue-700">
                  ✓ Check-out: {dayjs(attendance.check_out).format('HH:mm:ss')}
                </p>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleAttendance}
          disabled={
            (!canCheckIn && !canCheckOut) || checkInMutation.isPending || checkOutMutation.isPending
          }
          className={`w-full py-6 rounded-xl font-semibold text-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
            canCheckIn
              ? 'bg-green-600 text-white hover:bg-green-700'
              : canCheckOut
              ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-gray-400 text-white'
          }`}
        >
          <svg
            className="inline mr-2 w-6 h-6"
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
          {checkInMutation.isPending || checkOutMutation.isPending
            ? 'Memproses...'
            : canCheckIn
            ? 'Check-in'
            : canCheckOut
            ? 'Check-out'
            : 'Sudah Absen Hari Ini'}
        </button>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Catatan:</strong> Pastikan Anda melakukan absensi sesuai dengan jadwal kerja WFH
            Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
