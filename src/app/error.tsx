'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error in page:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full bg-white dark:bg-[#2D2528] rounded-3xl p-6 sm:p-8 border border-[#FFCED8] dark:border-[#4D383E] shadow-xl text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF0F3] dark:bg-[#38242A] border border-[#FFCED8] dark:border-[#5E3D46] flex items-center justify-center text-[#C75C73] dark:text-[#FFB3C6]">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-[#3D3133] dark:text-[#FFF0F3]">
            Terjadi Kendala Memuat Halaman
          </h3>
          <p className="text-xs text-[#6B5A5D] dark:text-[#D4B8BE] mt-1.5 leading-relaxed">
            Sistem mengalami kendala sementara saat memproses data. Anda dapat mencoba memuat ulang halaman.
          </p>
          {error.digest && (
            <span className="inline-block mt-2 text-[10px] text-[#A84157] dark:text-[#FFB3C6] font-mono bg-[#FFF0F3] dark:bg-[#241E20] px-2 py-0.5 rounded border border-[#FFCED8]/60 dark:border-[#4D383E]">
              Kode Sistem: {error.digest}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#C75C73] hover:bg-[#A84157] rounded-xl shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Coba Muat Ulang
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#863043] dark:text-[#FFCED8] bg-[#FFF5F7] dark:bg-[#241E20] border border-[#FFCED8] dark:border-[#4D383E] hover:bg-[#FFDDDD] rounded-xl transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            Ke Dashboard Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
