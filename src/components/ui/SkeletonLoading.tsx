'use client';

import React from 'react';

export function SkeletonLoading({
  cardsCount = 4,
  hasChart = false,
}: {
  cardsCount?: number;
  hasChart?: boolean;
}) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white/80 dark:bg-[#2D2528] p-5 rounded-3xl border border-[#FFCED8]/70 dark:border-[#4D383E] shadow-sm flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-[#FFCED8]/40 dark:bg-[#4D383E] rounded-xl" />
          <div className="h-3.5 w-72 bg-[#FFF4DE] dark:bg-[#382C24] rounded-lg" />
        </div>
        <div className="h-9 w-32 bg-[#FFCED8]/50 dark:bg-[#5E3D46] rounded-2xl" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className={`grid grid-cols-2 md:grid-cols-${cardsCount} gap-3.5`}>
        {Array.from({ length: cardsCount }).map((_, i) => (
          <div
            key={i}
            className="bg-white/90 dark:bg-[#2D2528] p-4 rounded-2xl border border-[#FFCED8]/60 dark:border-[#4D383E] space-y-2.5"
          >
            <div className="h-3 w-20 bg-[#FFDDDD]/60 dark:bg-[#4D2D37] rounded" />
            <div className="h-7 w-28 bg-[#FFE8C4]/50 dark:bg-[#4A3528] rounded-lg" />
            <div className="h-2.5 w-16 bg-[#FFF4DE] dark:bg-[#382C24] rounded" />
          </div>
        ))}
      </div>

      {/* Chart / Main Area Skeleton */}
      {hasChart && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#2D2528] p-5 rounded-3xl border border-[#FFCED8]/60 dark:border-[#4D383E] h-72 flex flex-col justify-between">
            <div className="h-4 w-40 bg-[#FFCED8]/40 dark:bg-[#4D383E] rounded" />
            <div className="h-48 w-full bg-[#FFF9FA] dark:bg-[#241E20] rounded-2xl border border-dashed border-[#FFCED8]/50 dark:border-[#4D383E] flex items-center justify-center">
              <div className="h-2 w-3/4 bg-[#FFCED8]/30 dark:bg-[#4D383E] rounded-full" />
            </div>
          </div>
          <div className="bg-white dark:bg-[#2D2528] p-5 rounded-3xl border border-[#FFCED8]/60 dark:border-[#4D383E] h-72 flex flex-col justify-between">
            <div className="h-4 w-40 bg-[#FFE8C4]/60 dark:bg-[#4A3528] rounded" />
            <div className="h-48 w-full bg-[#FFF9FA] dark:bg-[#241E20] rounded-2xl border border-dashed border-[#FFE8C4]/50 dark:border-[#4D383E] flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-dashed border-[#FFE8C4]/60 dark:border-[#4A3528]" />
            </div>
          </div>
        </div>
      )}

      {/* List Items Skeleton */}
      <div className="bg-white dark:bg-[#2D2528] rounded-3xl border border-[#FFCED8]/60 dark:border-[#4D383E] p-5 space-y-4">
        <div className="h-4 w-36 bg-[#FFCED8]/40 dark:bg-[#4D383E] rounded" />
        <div className="space-y-3">
          <div className="h-16 w-full bg-[#FFF9FA] dark:bg-[#241E20] rounded-2xl border border-[#FFCED8]/40 dark:border-[#4D383E]" />
          <div className="h-16 w-full bg-[#FFF9FA] dark:bg-[#241E20] rounded-2xl border border-[#FFCED8]/40 dark:border-[#4D383E]" />
          <div className="h-16 w-full bg-[#FFF9FA] dark:bg-[#241E20] rounded-2xl border border-[#FFCED8]/40 dark:border-[#4D383E]" />
        </div>
      </div>
    </div>
  );
}
