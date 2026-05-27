export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border animate-pulse ${className}`}
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="p-6">
        <div className="h-3 w-24 rounded-full mb-3" style={{ backgroundColor: 'var(--input-bg)' }} />
        <div className="h-8 w-16 rounded-full" style={{ backgroundColor: 'var(--input-bg)' }} />
      </div>
    </div>
  )
}

export function SkeletonProfile() {
  return (
    <div
      className="rounded-xl border mb-6 p-6 flex items-center gap-6 animate-pulse"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="w-14 h-14 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--input-bg)' }} />
      <div className="flex-1">
        <div className="h-4 w-32 rounded-full mb-2" style={{ backgroundColor: 'var(--input-bg)' }} />
        <div className="h-3 w-24 rounded-full" style={{ backgroundColor: 'var(--input-bg)' }} />
      </div>
      <div className="flex gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="text-center">
            <div className="h-6 w-8 rounded-full mb-1 mx-auto" style={{ backgroundColor: 'var(--input-bg)' }} />
            <div className="h-3 w-12 rounded-full" style={{ backgroundColor: 'var(--input-bg)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--input-bg)' }} />
          <div className="flex-1">
            <div className="h-3 rounded-full mb-1.5" style={{ backgroundColor: 'var(--input-bg)', width: `${60 + (i % 3) * 15}%` }} />
            <div className="h-2.5 w-16 rounded-full" style={{ backgroundColor: 'var(--input-bg)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonTask({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl p-4 border flex items-center gap-4 animate-pulse"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--input-bg)' }} />
          <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: 'var(--input-bg)', width: `${50 + (i % 3) * 20}%` }} />
          <div className="w-12 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--input-bg)' }} />
        </div>
      ))}
    </div>
  )
}