import { SkeletonLoading } from '@/components/ui/SkeletonLoading';

export default function Loading() {
  return (
    <div className="p-3.5 sm:p-5 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <SkeletonLoading cardsCount={4} hasChart={true} />
    </div>
  );
}
