/**
 * EditorWindow — the app's signature visual element. Wraps content in
 * code-editor chrome: traffic-light dots + a mono "filename" tab, tying
 * every screen back to the fact that this is a coding academy.
 */
export function EditorWindow({ label, children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-surface shadow-2xl shadow-black/40 overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-raised border-b border-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-brand-red/80" aria-hidden="true" />
        <span className="w-2.5 h-2.5 rounded-full bg-brand-amber/80" aria-hidden="true" />
        <span className="w-2.5 h-2.5 rounded-full bg-brand-green/80" aria-hidden="true" />
        {label && (
          <span className="ml-2 text-xs font-mono text-white/40 truncate">{label}</span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}
