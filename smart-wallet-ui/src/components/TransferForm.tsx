import { useState } from 'react'
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

        // Validation
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
            setSuccessMessage(`Virement de ${formData.amount} TND effectué avec succès!`)
            setFormData({
                recipientAccountNumber: '',
                amount: 0,
                description: ''
            })
            onTransferSuccess?.(response)
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Erreur lors du virement'
            onError?.(errorMessage)
            console.error('Transfer error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
            <div className="mb-8 space-y-2 text-left">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Transfert</p>
                <h2 className="text-3xl font-semibold tracking-tight text-text-primary">Envoyer de l'argent</h2>
                <p className="text-sm leading-6 text-text-secondary">
                    Effectuez un virement sécurisé vers un autre compte SmartWallet.
                </p>
            </div>

            {successMessage && (
                <div className="mb-4 rounded-2xl bg-success-light p-4 text-sm text-success-dark border border-success">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block space-y-2 text-left">
                    <span className="text-sm font-medium text-text-secondary">Numéro de compte du destinataire</span>
                    <input
                        type="text"
                        name="recipientAccountNumber"
                        value={formData.recipientAccountNumber}
                        required
                        className="w-full rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-accent focus:bg-surface-elevated focus:ring-4 focus:ring-accent/15"
                        placeholder="SW-1234567890"
                        onChange={handleChange}
                    />
                </label>

                <label className="block space-y-2 text-left">
                    <span className="text-sm font-medium text-text-secondary">Montant (TND)</span>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount || ''}
                        required
                        step="0.01"
                        min="0"
                        className="w-full rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-accent focus:bg-surface-elevated focus:ring-4 focus:ring-accent/15"
                        placeholder="100.00"
                        onChange={handleChange}
                    />
                </label>

                <label className="block space-y-2 text-left">
                    <span className="text-sm font-medium text-text-secondary">Description (optionnel)</span>
                    <textarea
                        name="description"
                        value={formData.description}
                        className="w-full rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-accent focus:bg-surface-elevated focus:ring-4 focus:ring-accent/15"
                        placeholder="Ex: Paiement de loyer"
                        rows={3}
                        onChange={handleChange}
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-2xl bg-accent px-4 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? 'Traitement...' : 'Effectuer le virement'}
                </button>
            </form>
        </div>
    )
}

export default TransferForm
