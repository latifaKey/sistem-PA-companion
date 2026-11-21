'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="bg-[#FAF5F5] text-[#2D2426] font-sans min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#FFCED8] shadow-xl text-center space-y-4">
          <h2 className="text-lg font-extrabold text-[#3D3133]">Terjadi Kendala Sistem</h2>
          <p className="text-xs text-[#6B5A5D]">
            Sistem mengalami kendala sementara saat memuat struktur halaman. Silakan muat ulang.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2 text-xs font-bold text-white bg-[#C75C73] hover:bg-[#A84157] rounded-xl shadow transition-all"
          >
            Muat Ulang Halaman
          </button>
        </div>
      </body>
    </html>
  );
}
