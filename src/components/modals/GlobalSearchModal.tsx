'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, CheckSquare, FileText, BookOpen, BookMarked, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#FFCED8] w-full max-w-xl overflow-hidden animate-fade-in">
        {/* Search Input */}
        <div className="p-4 border-b border-[#FFDDDD] flex items-center gap-3 bg-[#FFF9FA]">
          <Search className="w-5 h-5 text-[#A84157]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik kata kunci (misal: 'abstrak', 'LDA', 'bimbingan', 'revisi')..."
            className="w-full text-xs font-semibold focus:outline-none placeholder-[#A84157]/60 bg-transparent text-[#3D3133]"
            autoFocus
          />
          <button onClick={onClose} className="text-[#A84157] hover:text-[#863043] p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#FFF0F3] p-2">
          {loading && <div className="p-4 text-center text-xs text-[#A84157]">Mencari data penelitian...</div>}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="p-6 text-center text-xs text-[#A84157]">
              Tidak ditemukan hasil untuk "{query}"
            </div>
          )}

          {!loading &&
            results.map((item, idx) => {
              const Icon =
                item.type === 'TASK'
                  ? CheckSquare
                  : item.type === 'REVIEW'
                  ? FileText
                  : item.type === 'REFERENCE'
                  ? BookOpen
                  : BookMarked;

              return (
                <Link
                  key={idx}
                  href={item.link}
                  onClick={onClose}
                  className="p-3 rounded-xl hover:bg-[#FFF5F7] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#FFDDDD] text-[#863043] mt-0.5 border border-[#FFCED8]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#3D3133] group-hover:text-[#863043] transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#6B5A5D] mt-0.5">{item.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A84157] group-hover:text-[#863043] group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
