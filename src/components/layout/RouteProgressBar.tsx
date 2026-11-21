'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function RouteProgressBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Whenever pathname changes, flash a smooth progress bar
    setLoading(true);
    setProgress(35);

    const timer1 = setTimeout(() => {
      setProgress(85);
    }, 60);

    const timer2 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 160);
    }, 140);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-1 bg-transparent overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-[#C75C73] via-[#FFCED8] to-[#FFE8C4] transition-all duration-200 ease-out shadow-[0_0_8px_rgba(199,92,115,0.6)]"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: 'width 180ms ease, opacity 160ms ease',
        }}
      />
    </div>
  );
}
