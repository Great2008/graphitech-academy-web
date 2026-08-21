/**
 * Loader -- the app's global loading indicator: the GraphiTech Foundation
 * icon bouncing in place. Used anywhere a page is waiting on data, so the
 * screen never just sits blank with no feedback.
 */
export function Loader({ size = 'md', label }) {
  const sizeClass = size === 'sm' ? 'h-6' : size === 'lg' ? 'h-16' : 'h-10'
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <img
        src="/logo-icon.png"
        alt="Loading…"
        className={`${sizeClass} w-auto animate-bounce`}
      />
      {label && <p className="text-xs text-white/30 font-mono">{label}</p>}
    </div>
  )
}
