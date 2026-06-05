import axios from 'axios'
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  AlertCircle,
  ArrowLeftRight,
  Banknote,
  CheckCircle2,
  CircleDollarSign,
  Loader2,
  ReceiptText,
  Send,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type {
  DepositRequest,
  ExpenseRequest,
  TransactionCategory,
  TransactionResponse,
  TransferRequest,
} from '../api/types'
import { createDeposit, createExpense, initiateTransfer } from '../services/transaction.service'

type FormMode = 'transfer' | 'expense' | 'deposit'

interface TransferFormProps {
  onTransferSuccess?: (transaction: TransactionResponse) => void
  onError?: (error: string) => void
}

const expenseCategories: TransactionCategory[] = [
  'ALIMENTATION',
  'TRANSPORT',
  'LOISIRS',
  'SHOPPING',
  'REVENUS',
  'AUTRE',
]

function TransferForm({ onTransferSuccess, onError }: TransferFormProps) {
  const { wallet, refreshUserData } = useAuth()
  const [mode, setMode] = useState<FormMode>('transfer')
  const [formData, setFormData] = useState<TransferRequest & { category: TransactionCategory }>({
    recipientAccountNumber: '',
    amount: 0,
    description: '',
    category: 'ALIMENTATION',
  })
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const availableBalance = wallet?.balance ?? 0

  const remainingBalance = useMemo(() => availableBalance - formData.amount, [availableBalance, formData.amount])

  const resetFeedback = () => {
    if (successMessage) setSuccessMessage('')
    if (errorMessage) setErrorMessage('')
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }))

    resetFeedback()
  }

  const switchMode = (nextMode: FormMode) => {
    if (nextMode === mode) {
      return
    }

    setMode(nextMode)
    setSuccessMessage('')
    setErrorMessage('')
  }

  const validateAmount = () => {
    if (formData.amount <= 0) {
      return 'Le montant doit être supérieur à 0'
    }

    if (mode !== 'deposit' && formData.amount > availableBalance) {
      return 'Le montant dépasse le solde disponible'
    }

    return ''
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    const amountError = validateAmount()
    if (amountError) {
      setErrorMessage(amountError)
      onError?.(amountError)
      setLoading(false)
      return
    }

    if ((mode === 'transfer' || mode === 'expense') && !wallet) {
      const msg = 'Portefeuille indisponible. Veuillez réessayer.'
      setErrorMessage(msg)
      onError?.(msg)
      setLoading(false)
      return
    }

    if (mode === 'transfer' && !formData.recipientAccountNumber.trim()) {
      const msg = 'Veuillez entrer l’identifiant du destinataire'
      setErrorMessage(msg)
      onError?.(msg)
      setLoading(false)
      return
    }

    try {
      let response: TransactionResponse

      if (mode === 'transfer') {
        const transferRequest: TransferRequest = {
          recipientAccountNumber: formData.recipientAccountNumber.trim(),
          amount: formData.amount,
          description: formData.description,
        }

        response = await initiateTransfer(transferRequest)
      } else if (mode === 'expense') {
        const expenseRequest: ExpenseRequest = {
          amount: formData.amount,
          category: formData.category,
          description: formData.description,
        }

        response = await createExpense(expenseRequest)
      } else {
        const depositRequest: DepositRequest = {
          amount: formData.amount,
        }

        response = await createDeposit(depositRequest)
      }

      setSuccessMessage(
        mode === 'transfer'
          ? 'Transfert effectué avec succès !'
          : mode === 'expense'
            ? 'Dépense enregistrée avec succès !'
            : 'Dépôt crédité avec succès !',
      )
      setFormData((prev) => ({
        ...prev,
        recipientAccountNumber: '',
        amount: 0,
        description: '',
        category: 'ALIMENTATION',
      }))

      onTransferSuccess?.(response)
      await refreshUserData()
    } catch (error: unknown) {
      let errorMsg = 'Erreur lors de l’opération'

      if (axios.isAxiosError(error)) {
        errorMsg =
          typeof error.response?.data === 'object' && error.response?.data && 'message' in error.response.data
            ? String(error.response.data.message)
            : error.response?.data?.message || error.message || errorMsg
      } else if (error instanceof Error) {
        errorMsg = error.message
      }

      setErrorMessage(errorMsg)
      onError?.(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`relative transition-all duration-500 ${successMessage ? 'scale-[1.01]' : ''}`}>
      <div className={`pointer-events-none absolute inset-0 -z-10 rounded-4xl bg-amber-400/10 blur-[60px] transition-opacity duration-700 ${successMessage ? 'opacity-100' : 'opacity-0'}`} />

      <div className="mb-6 flex w-full items-center gap-1.5 p-1 bg-black/40 border border-white/5 rounded-2xl">
        <button
          type="button"
          onClick={() => switchMode('transfer')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 text-xs font-medium rounded-xl transition-all duration-300 shrink-0 select-none ${
            mode === 'transfer'
              ? 'bg-amber-400/10 text-amber-200 border border-amber-400/20 shadow-[0_0_12px_rgba(251,191,36,0.05)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          <ArrowLeftRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">Transfert P2P</span>
        </button>
        <button
          type="button"
          onClick={() => switchMode('expense')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 text-xs font-medium rounded-xl transition-all duration-300 shrink-0 select-none ${
            mode === 'expense'
              ? 'bg-amber-400/10 text-amber-200 border border-amber-400/20 shadow-[0_0_12px_rgba(251,191,36,0.05)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          <ReceiptText className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">Dépense</span>
        </button>
        <button
          type="button"
          onClick={() => switchMode('deposit')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 text-xs font-medium rounded-xl transition-all duration-300 shrink-0 select-none ${
            mode === 'deposit'
              ? 'bg-amber-400/10 text-amber-200 border border-amber-400/20 shadow-[0_0_12px_rgba(251,191,36,0.05)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          <CircleDollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">Dépôt</span>
        </button>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-widest text-amber-300 uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            {mode === 'transfer' ? 'Virement Premium' : mode === 'expense' ? 'Dépense Premium' : 'Top-up Premium'}
          </p>
          <p className="text-sm font-medium text-zinc-400">
            {mode === 'transfer'
              ? 'Envoyez de l’argent à un portefeuille SmartWallet.'
              : mode === 'expense'
                ? 'Enregistrez une dépense catégorisée en quelques secondes.'
                : 'Alimentez instantanément votre portefeuille SmartWallet.'}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">Solde dispo.</p>
          <p className="text-sm font-black text-amber-200">
            {availableBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} TND
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 flex items-center gap-4 rounded-2xl border border-emerald-200/30 bg-emerald-500/10 p-5 text-emerald-200 shadow-lg shadow-emerald-500/10 backdrop-blur-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100/10 text-emerald-300">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold tracking-tight">Terminé</p>
            <p className="text-sm font-medium text-emerald-100/80">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 flex items-center gap-4 rounded-2xl border border-rose-200/20 bg-rose-500/10 p-5 text-rose-200 shadow-lg shadow-rose-500/10 backdrop-blur-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-300">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold tracking-tight text-rose-300">Erreur</p>
            <p className="text-sm font-medium text-rose-100/80">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === 'transfer' && (
          <div className="group relative">
            <input
              type="text"
              name="recipientAccountNumber"
              id="recipientAccountNumber"
              value={formData.recipientAccountNumber}
              required={mode === 'transfer'}
              className="peer w-full rounded-2xl border border-white/10 bg-white/5 px-5 pb-3 pt-6 text-white outline-none backdrop-blur-sm transition-all duration-300 hover:border-white/20 focus:border-amber-300/60 focus:bg-white/10 focus:ring-4 focus:ring-amber-300/10 placeholder-transparent"
              placeholder="SW-0000-0000"
              onChange={handleChange}
            />
            <label
              htmlFor="recipientAccountNumber"
              className="pointer-events-none absolute left-5 top-2 text-xs font-bold text-amber-300 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-zinc-400 peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-amber-300"
            >
              Identifiant destinataire
            </label>
          </div>
        )}

        {mode === 'expense' && (
          <div className="group relative">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="peer w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-5 pb-3 pt-6 text-white outline-none backdrop-blur-sm transition-all duration-300 hover:border-white/20 focus:border-amber-300/60 focus:bg-white/10 focus:ring-4 focus:ring-amber-300/10"
            >
              {expenseCategories.map((category) => (
                <option key={category} value={category} className="bg-zinc-950 text-white">
                  {category}
                </option>
              ))}
            </select>
            <label className="pointer-events-none absolute left-5 top-2 text-xs font-bold text-amber-300 transition-all duration-300">
              Catégorie
            </label>
          </div>
        )}

        <div className="group relative flex items-baseline justify-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-5 py-8">
          <input
            type="number"
            name="amount"
            value={formData.amount || ''}
            required
            step="0.01"
            min="0"
            className="w-full max-w-70 bg-transparent p-0 text-center text-5xl font-black tracking-tighter text-white border-none outline-none focus:ring-0 placeholder:text-white/20 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0.00"
            onChange={handleChange}
          />
          <span className="text-3xl font-bold text-white/40 transition-colors duration-300 group-focus-within:text-amber-300">TND</span>
          <div className="pointer-events-none absolute bottom-3 left-1/2 h-0.5 w-24 -translate-x-1/2 rounded-full bg-white/10 transition-all duration-300 group-focus-within:w-32 group-focus-within:bg-amber-300" />
        </div>

        <div className="text-xs text-zinc-500">
          {mode === 'transfer'
            ? `Solde restant estimé après envoi : ${Math.max(remainingBalance, 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} TND`
            : mode === 'expense'
              ? 'Le montant de la dépense doit rester inférieur au solde disponible.'
              : 'Le dépôt créditera votre carte premium et apparaîtra dans le fil et les graphiques.'}
        </div>

        <button
          type="submit"
          disabled={loading || (mode !== 'deposit' && availableBalance <= 0)}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,rgba(250,204,21,0.96),rgba(202,138,4,0.92))] px-4 py-4.5 text-base font-black text-zinc-950 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_40px_-10px_rgba(202,138,4,0.45)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex items-center justify-center gap-2">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Traitement en cours...</span>
              </>
            ) : (
              <>
                <span>
                  {mode === 'transfer' ? 'Confirmer le virement' : mode === 'expense' ? 'Enregistrer la dépense' : 'Créditer le compte'}
                </span>
                {mode === 'deposit' ? (
                  <Banknote className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                ) : (
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                )}
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  )
}

export default TransferForm
