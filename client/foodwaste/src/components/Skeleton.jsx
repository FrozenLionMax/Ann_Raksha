/**
 * Reusable skeleton loading components with shimmer animation
 */

function Shimmer({ className = '' }) {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
      <div className="flex justify-between items-start">
        <Shimmer className="h-5 w-2/3" />
        <Shimmer className="h-5 w-16 rounded-full" />
      </div>
      <Shimmer className="h-4 w-1/2" />
      <div className="flex gap-3 pt-2">
        <Shimmer className="h-4 w-20" />
        <Shimmer className="h-4 w-24" />
      </div>
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-10 w-full rounded-xl mt-2" />
    </div>
  );
}

export function SkeletonList({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Shimmer className="h-8 w-48" />
          <Shimmer className="h-4 w-32" />
        </div>
        <Shimmer className="h-10 w-36 rounded-xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
            <Shimmer className="h-4 w-20" />
            <Shimmer className="h-8 w-16" />
            <Shimmer className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Charts area */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <Shimmer className="h-5 w-32" />
          <Shimmer className="h-48 w-full" />
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <Shimmer className="h-5 w-32" />
          <Shimmer className="h-48 w-full" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
        <Shimmer className="h-5 w-40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            <Shimmer className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <Shimmer className="h-4 w-3/4" />
              <Shimmer className="h-3 w-1/2" />
            </div>
            <Shimmer className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-6">
        <Shimmer className="h-24 w-24 rounded-full" />
        <div className="space-y-2 flex-1">
          <Shimmer className="h-7 w-48" />
          <Shimmer className="h-4 w-32" />
          <Shimmer className="h-4 w-56" />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
            <Shimmer className="h-4 w-20" />
            <Shimmer className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
