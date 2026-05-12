import { useState } from 'react'
import api from '../api/axiosConfig'
import type { TransferRequest } from '../api/types'

interface TransferFormProps {
  onTransferSuccess: () => Promise<void>;
}

function TransferForm({ onTransferSuccess }: TransferFormProps) {
  const [formData, setFormData] = useState<TransferRequest>({
    toAccountNumber: '',
    amount: 0,
    description: '',
    category: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((previous) => ({
      ...previous,
      [name]: name === 'amount' ? Number(value) : value,
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.post('/transactions/transfer', formData)
      setFormData({ toAccountNumber: '', amount: 0, description: '', category: '' })
      await onTransferSuccess()
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: string } }
      setError(apiError.response?.data || 'Echec du transfert.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Nouveau transfert</h3>

      {error && (
        <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          name="toAccountNumber"
          value={formData.toAccountNumber}
          onChange={onChange}
          required
          placeholder="Compte beneficiaire (ex: SW123456)"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
        <input
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          value={formData.amount || ''}
          onChange={onChange}
          required
          placeholder="Montant"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
        <input
          name="category"
          value={formData.category || ''}
          onChange={onChange}
          placeholder="Categorie (optionnel)"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
        <input
          name="description"
          value={formData.description || ''}
          onChange={onChange}
          placeholder="Description"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? 'Envoi...' : 'Transferer'}
      </button>
    </form>
  )
}

export default TransferForm
