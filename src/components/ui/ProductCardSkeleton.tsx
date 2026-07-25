export function ProductCardSkeleton() {
  return (
    <div className="bg-surface-container-low rounded-xl p-6 border-2 border-on-surface/10 flex flex-col gap-6 h-full pointer-events-none">
      {/* Image Skeleton Box */}
      <div className="w-full h-48 rounded-lg skeleton-shimmer mt-6 border border-outline-variant/20" />

      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Title */}
        <div className="h-7 w-3/4 rounded-md skeleton-shimmer" />
        <div className="h-7 w-1/2 rounded-md skeleton-shimmer" />

        {/* Specs List */}
        <div className="space-y-2 my-3">
          <div className="h-4 w-5/6 rounded skeleton-shimmer" />
          <div className="h-4 w-4/6 rounded skeleton-shimmer" />
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between mt-auto gap-2 pt-2">
          <div className="h-10 flex-1 rounded-full skeleton-shimmer" />
          <div className="h-10 w-10 rounded-full skeleton-shimmer flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
