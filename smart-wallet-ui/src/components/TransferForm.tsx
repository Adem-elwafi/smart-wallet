import { useState } from 'react'
import { Send, CheckCircle2, Loader2 } from 'lucide-react'
import type { TransferRequest, TransactionResponse } from '../api/types'
import { initiateTransfer } from '../services/transaction.service'

interface TransferFormProps {
    onTransferSuccess?: (transaction: TransactionResponse) => void
    onError?: (error: string) => void
}

function TransferForm({ onTransferSuccess, onError }: TransferFormProps) {
    const [formData, setFormData] = useState<TransferRequest>({
        recipientAccountNumber: '',
        amount: 0,
        description: ''
    })
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setSuccessMessage('')

        if (!formData.recipientAccountNumber.trim()) {
            onError?.('Veuillez entrer le numéro de compte du destinataire')
            setLoading(false)
            return
        }

        if (formData.amount <= 0) {
            onError?.('Le montant doit être supérieur à 0')
            setLoading(false)
            return
        }

        try {
            const response = await initiateTransfer(formData)
            setSuccessMessage(`Virement effectué avec succès !`)
            setFormData({
                recipientAccountNumber: '',
                amount: 0,
                description: ''
            })
            onTransferSuccess?.(response)
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Erreur lors du virement'
            onError?.(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white">
            <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-1">Sécurisé</p>
                <p className="text-sm text-slate-500">
                    Virement instantané sans frais vers un autre compte SmartWallet.
                </p>
            </div>

            {successMessage && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium">{successMessage}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">
                        Destinataire
                    </label>
                    <div className="relative group">
                        <input
                            type="text"
                            name="recipientAccountNumber"
                            value={formData.recipientAccountNumber}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 placeholder:text-slate-400"
                            placeholder="SW-0000-0000"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">
                        Montant (TND)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount || ''}
                            required
                            step="0.01"
                            min="0"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-lg font-semibold text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 placeholder:text-slate-400"
                            placeholder="0.00"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">
                        Note (Optionnelle)
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 placeholder:text-slate-400 resize-none"
                        placeholder="Raison du transfert..."
                        rows={2}
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-sky-600 px-4 py-4 font-bold text-white transition-all hover:bg-sky-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-sky-600/20"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span>Confirmer le virement</span>
                            <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}

export default TransferForm