import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import api from '../api/axiosConfig'
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

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Wallet</h1>
            <p className="text-sm text-slate-600">Compte: {wallet?.accountNumber || '...'}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/profile" className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
              Profil
            </Link>
            <button onClick={logout} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white">
              Deconnexion
            </button>
          </div>
        </header>

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
    </main>
  )
}

export default DashboardPage
