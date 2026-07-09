export function FormInput({ label, ...props }) {
  return (
    <label className="block text-left mb-4">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
      />
    </label>
  )
}

export function PrimaryButton({ children, loading, className = '', ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full bg-brand-purple text-white font-semibold py-3 rounded-full shadow-md hover:opacity-90 transition disabled:opacity-50 ${className}`}
    >
      {loading ? 'Please wait…' : children}
    </button>
  )
}

export function ErrorMessage({ message }) {
  if (!message) return null
  return <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 mb-4">{message}</p>
}
