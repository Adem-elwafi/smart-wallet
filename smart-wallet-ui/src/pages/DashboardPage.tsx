import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TransactionsList from '../components/TransactionsList'
import TransferForm from '../components/TransferForm'
import { getMyWallet } from '../services/wallet.service'
import { getTransactionHistory } from '../services/transaction.service'
import type { TransactionResponse, WalletResponse } from '../api/types'

function DashboardPage() {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState<WalletResponse | null>(null)
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [walletData, txData] = await Promise.all([
        getMyWallet(),
        getTransactionHistory(),
      ])
      setWallet(walletData)
      setTransactions(txData)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          navigate('/login')
          return
        }
        const errorMessage = 
          typeof err.response?.data === 'object' && err.response?.data && 'message' in err.response.data
            ? (err.response.data as any).message
            : 'Impossible de charger les données du dashboard.'
        setError(errorMessage)
      } else {
        setError('Une erreur inattendue est survenue.')
      }
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    void loadData()
  }, [loadData])

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600">Compte: {wallet?.accountNumber || '...'}</p>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm uppercase tracking-wide text-slate-500">Solde global</p>
        <p className="mt-2 text-3xl font-black text-slate-900">
          {(wallet?.balance || 0).toLocaleString('fr-FR', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })} {wallet?.currency || 'TND'}
        </p>
      </section>

      <TransferForm onTransferSuccess={loadData} />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Activités récentes</h2>

        {error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        )}

        {loading ? (
          <p className="text-sm text-slate-500">Chargement...</p>
        ) : (
          <TransactionsList transactions={transactions} />
        )}
      </section>
    </div>
  )
}

export default DashboardPage
