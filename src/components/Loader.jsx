/**
 * Loader -- the app's global loading indicator: the GraphiTech Foundation
 * icon growing and shrinking in place. Used anywhere a page is waiting on
 * data, so the screen never just sits blank with no feedback. Sized large
 * by default since on a small mobile viewport a tiny spinner barely reads
 * as "loading" at all.
 */
export function Loader({ size = 'md', label }) {
  const sizeClass = size === 'sm' ? 'h-12' : size === 'lg' ? 'h-28' : 'h-20'
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <img
        src="/logo-icon.png"
        alt="Loading…"
        className={`${sizeClass} w-auto animate-scale-pulse`}
      />
      {label && <p className="text-xs text-white/30 font-mono">{label}</p>}
    </div>
  )
}
