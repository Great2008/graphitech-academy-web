export function FormInput({ label, ...props }) {
  return (
    <label className="block text-left mb-4">
      <span className="text-sm font-medium text-white/70">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
      />
    </label>
  )
}

export function PrimaryButton({ children, loading, className = '', ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full bg-brand-purple text-white font-semibold py-3 rounded-full shadow-lg shadow-brand-purple/20 hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50 ${className}`}
    >
      {loading ? 'Please wait…' : children}
    </button>
  )
}

export function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <p className="text-sm text-brand-red bg-brand-red/10 border border-brand-red/20 rounded-lg px-4 py-2 mb-4 font-mono">
      {message}
    </p>
  )
}
