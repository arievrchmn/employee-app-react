// src/pages/SummaryPage.tsx

import { useState } from 'react';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '../lib/api';

export function SummaryPage() {
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const limit = 10;

  const { data: summaryData, isLoading } = useQuery({
    queryKey: ['attendance-summary', page, startDate, endDate],
    queryFn: () =>
      attendanceApi.getSummary({
        page,
        limit,
        start_date: startDate,
        end_date: endDate,
      }),
  });

  const handleFilter = () => {
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const attendances = summaryData?.data || [];
  const meta = summaryData?.meta;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Summary Absensi</h2>

      {/* Filter */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleFilter}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 2v-8.5L3.293 5.293A1 1 0 013 4.586V4z"
              />
            </svg>
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tanggal</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Waktu Masuk
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Waktu Pulang
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendances.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  Tidak ada data absensi
                </td>
              </tr>
            ) : (
              attendances.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {dayjs(item.date).format('DD MMMM YYYY')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {item.check_in ? dayjs(item.check_in).format('HH:mm:ss') : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {item.check_out ? dayjs(item.check_out).format('HH:mm:ss') : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Menampilkan {attendances.length} dari {meta.total} data
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 border border-gray-300 rounded-lg bg-indigo-50 text-indigo-600 font-medium">
              {page} / {meta.total_pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
              disabled={page === meta.total_pages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
