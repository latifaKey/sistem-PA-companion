import React from 'react';
import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full bg-white dark:bg-[#2D2528] rounded-3xl p-6 sm:p-8 border border-[#FFCED8] dark:border-[#4D383E] shadow-xl text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF4DE] dark:bg-[#382C24] border border-[#FFE8C4] dark:border-[#4D383E] flex items-center justify-center text-[#863043] dark:text-[#FFE8C4]">
          <Compass className="w-7 h-7" />
        </div>

        <div>
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#FFDDDD] dark:bg-[#4D2D37] text-[#863043] dark:text-[#FFCED8] uppercase tracking-wider">
            Status 404
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-[#3D3133] dark:text-[#FFF0F3] mt-2">
            Halaman Tidak Ditemukan
          </h3>
          <p className="text-xs text-[#6B5A5D] dark:text-[#D4B8BE] mt-1.5 leading-relaxed">
            Halaman atau tautan yang Anda tuju tidak tersedia atau telah dipindahkan.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold text-[#863043] dark:text-[#FFF0F3] bg-gradient-to-r from-[#FFCED8] via-[#FFDDDD] to-[#FFE8C4] dark:from-[#4D2633] dark:via-[#542D3B] dark:to-[#543428] rounded-xl shadow-sm border border-[#F5A8B8] dark:border-[#7A3C4E] hover:opacity-95 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            Kembali ke Dashboard Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
