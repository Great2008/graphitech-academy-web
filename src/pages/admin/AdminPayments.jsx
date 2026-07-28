import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

const STATUS_COLORS = {
  paid: 'text-brand-green',
  pending: 'text-brand-amber',
  failed: 'text-brand-red',
  refunded: 'text-white/40',
}

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/api/admin/payments')
      .then(setPayments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const totalPaidKobo = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount_kobo, 0)

  return (
    <div className="min-h-[calc(100vh-73px-42px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        <p className="font-mono text-xs text-brand-sky mb-1">$ admin/payments</p>
        <h1 className="font-display font-bold text-xl text-white mb-1">
          Payments ({payments.length})
        </h1>
        <p className="text-sm text-brand-green font-mono mb-6">
          ₦{(totalPaidKobo / 100).toLocaleString()} total collected
        </p>

        {error && <p className="text-brand-red font-mono text-sm mb-4">{error}</p>}
        {loading && <p className="text-white/40 font-mono text-sm">loading…</p>}
        {!loading && payments.length === 0 && (
          <p className="text-white/40 text-sm">No payments yet.</p>
        )}

        <div className="space-y-2">
          {payments.map((p) => (
            <div key={p.id} className="bg-surface border border-white/5 rounded-xl p-4">
              <div className="flex justify-between items-start gap-2 mb-1">
                <p className="text-white font-semibold">₦{(p.amount_kobo / 100).toLocaleString()}</p>
                <span className={`text-xs font-mono shrink-0 ${STATUS_COLORS[p.status] || 'text-white'}`}>
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-white/40 font-mono">
                {p.purpose} {p.paystack_channel && `· ${p.paystack_channel}`}
              </p>
              {p.paystack_reference && (
                <p className="text-xs text-white/20 font-mono mt-1 truncate">{p.paystack_reference}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
