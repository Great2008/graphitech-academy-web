export function DragHintBanner({ onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-2 py-2.5 bg-surface-raised border-t border-white/5 font-mono text-xs text-white/40"
    >
      <span aria-hidden="true">⌄</span>
      drag down to open menu
    </button>
  )
}
