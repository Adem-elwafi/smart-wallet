import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TransactionsList from '../components/TransactionsList'
import TransferForm from '../components/TransferForm'
import { getMyWallet } from '../services/wallet.service'
import { getTransactionHistory } from '../services/transaction.service'
import type { TransactionResponse, WalletResponse, Profile } from '../api/types'
import api from '../api/axiosConfig'

function DashboardPage() {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState<WalletResponse | null>(null)
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [walletData, txData, profileResponse] = await Promise.all([
        getMyWallet(),
        getTransactionHistory(),
        api.get<Profile>('/v1/profile/me')
      ])
      setWallet(walletData)
      setTransactions(txData)
      setProfile(profileResponse.data)
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

  // Full-page Skeleton Loader matching the dashboard shape
  if (loading && !wallet && transactions.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Skeleton Wallet Card */}
        <div className="h-[280px] w-full rounded-[2rem] bg-white/[0.03] border border-white/[0.08] animate-pulse shadow-sm" />
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Skeleton Transfer Form */}
          <div className="flex w-full flex-col gap-4 rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8 shadow-xl">
             <div className="mb-4 h-8 w-48 animate-pulse rounded-lg bg-white/10" />
             <div className="h-14 w-full animate-pulse rounded-xl bg-white/10" />
             <div className="h-14 w-full animate-pulse rounded-xl bg-white/10" />
             <div className="mt-2 h-12 w-40 animate-pulse rounded-xl bg-white/10" />
          </div>

          {/* Skeleton Transactions List */}
          <div className="flex w-full min-h-[400px] flex-col gap-5 rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8 shadow-xl lg:col-span-2">
             <div className="mb-4 h-8 w-56 animate-pulse rounded-lg bg-white/10" />
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-white/10" />
             ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8 selection:bg-cyan-500/30">
      
      {/* 1. Enhanced Premium Wallet Card */}
      <section className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-black p-8 sm:p-10 shadow-[0_0_40px_-10px_rgba(14,165,233,0.5)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_50px_-5px_rgba(14,165,233,0.6)] animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
        
        {/* SVG Noise Texture Overlay */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay" 
          style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
        />
        
        {/* Ambient Glowing Orbs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[80px] transition-transform duration-700 group-hover:scale-110" />
        <div className="pointer-events-none absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-blue-500/20 blur-[80px] transition-transform duration-700 group-hover:scale-110" />

        <div className="relative z-10 flex flex-col space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tighter text-white sm:text-5xl">Bonjour, {profile?.fullName?.split(' ')[0] || profile?.username || ''}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse" />
                Carte Fintech • {wallet?.accountNumber || '••••'}
              </p>
            </div>
            {/* Mock EMV Chip */}
            <div className="h-10 w-12 rounded-md bg-gradient-to-br from-amber-200/90 to-amber-500/90 border border-amber-100/20 opacity-80 shadow-inner backdrop-blur-sm" />
          </div>
          
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Solde Disponible</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-7xl">
                {(wallet?.balance || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-2xl font-bold text-cyan-400 sm:text-3xl">{wallet?.currency || 'TND'}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 2. Glassy Transfer Form Section */}
        <section className="rounded-[2rem] border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[150ms] fill-mode-both lg:col-span-1">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white/90">Envoyer de l'argent</h2>
          </div>
          <TransferForm onTransferSuccess={loadData} />
        </section>

        {/* 3. Glassy Recent Activities Section */}
        <section className="rounded-[2rem] border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[300ms] fill-mode-both lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-white/90">Activités récentes</h2>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/25 bg-rose-500/10 px-5 py-4 text-sm text-rose-300 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <TransactionsList transactions={transactions} />
        </section>
      </div>
      
    </div>
  )
}

export default DashboardPage