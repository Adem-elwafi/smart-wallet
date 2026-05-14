import { useState } from 'react'
import { initiateTransfer } from '../services/transaction.service'
import type { TransferRequest } from '../api/types'

interface TransferFormProps {
  onTransferSuccess: () => Promise<void>
}

function TransferForm({ onTransferSuccess }: TransferFormProps) {
  const [formData, setFormData] = useState<TransferRequest>({
    recipientAccountNumber: '',
    amount: 0,
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setSuccess(null)

    // Validation
    if (!formData.recipientAccountNumber.trim()) {
      setError('Veuillez entrer le numéro de compte du destinataire')
      setLoading(false)
      return
    }

    if (formData.amount <= 0) {
      setError('Le montant doit être supérieur à 0')
      setLoading(false)
      return
    }

    try {
      await initiateTransfer(formData)
      setSuccess(`Virement de ${formData.amount} TND effectué avec succès!`)
      setFormData({ recipientAccountNumber: '', amount: 0, description: '' })
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
      await onTransferSuccess()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Échec du transfert.'
      setError(errorMessage)
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

      {success && (
        <p className="mt-3 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          name="recipientAccountNumber"
          value={formData.recipientAccountNumber}
          onChange={onChange}
          required
          placeholder="Compte bénéficiaire (ex: SW-1234567890)"
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
          placeholder="Montant (TND)"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={onChange}
          placeholder="Description (optionnel)"
          rows={2}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 md:col-span-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? 'Envoi...' : 'Transférer'}
      </button>
    </form>
  )
}

export default TransferForm

