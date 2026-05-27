import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
  Bell,
  CreditCard,
  Copy,
  History,
  PieChart,
  Search,
  TrendingDown,
  TrendingUp,
  User,
  Wallet
} from 'lucide-react'
import axios from 'axios'
import TransactionsList from '../components/TransactionsList'
import TransferForm from '../components/TransferForm'
import { getMyWallet } from '../services/wallet.service'
import { getTransactionHistory } from '../services/transaction.service'
import type { Profile, TransactionResponse, WalletResponse } from '../api/types'
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

        setError('Impossible de charger les données du dashboard.')
      } else {
        setError('Une erreur inattendue est survenue.')
      }
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    queueMicrotask(() => {
      void loadData()
    })
  }, [loadData])

  const copyAccountNumber = () => {
    if (wallet?.accountNumber) {
      navigator.clipboard.writeText(wallet.accountNumber)
    }
  }

  const accountNumber = wallet?.accountNumber ?? ''

  const monthlyIncomes = transactions
    .filter((tx) => (accountNumber ? tx.recipientAccountNumber === accountNumber : tx.type === 'CREDIT'))
    .reduce((acc, tx) => acc + tx.amount, 0)

  const monthlyExpenses = transactions
    .filter((tx) => (accountNumber ? tx.senderAccountNumber === accountNumber : tx.type === 'DEBIT'))
    .reduce((acc, tx) => acc + tx.amount, 0)

  const savings = monthlyIncomes - monthlyExpenses

  const stats = [
    { title: 'Revenus ce mois', value: monthlyIncomes, trend: 12, icon: TrendingUp, color: 'text-emerald-300' },
    { title: 'Dépenses', value: monthlyExpenses, trend: -5, icon: TrendingDown, color: 'text-rose-300' },
    { title: 'Économies', value: savings, trend: 8, icon: PieChart, color: 'text-amber-300' }
  ]

  if (loading && !wallet) {
    return (
      <div className="flex h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.08),transparent_35%),linear-gradient(180deg,#090807_0%,#0b0a09_100%)] text-amber-200">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-300/20 border-t-amber-300" />
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/80">Initialisation de votre espace Elite...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.08),transparent_30%),linear-gradient(180deg,#090807_0%,#0b0a09_100%)] text-zinc-100">
      <div className="mx-auto w-full max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6 animate-fade-in lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-8">
            <div className="flex cursor-pointer items-center gap-3 group">
              <div className="rounded-2xl bg-amber-300 p-2 shadow-[0_0_30px_rgba(251,191,36,0.25)] transition-transform duration-500 group-hover:rotate-12">
                <Wallet className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-zinc-100">
                  FINANCIAL<span className="text-amber-300">ELITE</span>
                </h1>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Smart wallet control center</p>
              </div>
            </div>

            <nav className="hidden items-center gap-6 xl:flex">
              {['Vue d\'ensemble', 'Transactions', 'Cartes', 'Investir'].map((item, index) => (
                <button
                  key={item}
                  className={`text-sm font-medium transition-colors hover:text-amber-200 ${index === 0 ? 'text-amber-200' : 'text-zinc-400'}`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-56 rounded-full border border-white/5 bg-zinc-900/60 py-2 pl-10 pr-4 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-amber-300/50 focus:bg-zinc-900/90 lg:w-64"
              />
            </div>

            <div className="flex items-center gap-4 rounded-full border border-white/5 bg-white/5 px-3 py-2 backdrop-blur-sm">
              <button className="relative p-2 text-zinc-400 transition-colors hover:text-amber-200" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#0b0a09] bg-amber-300" />
              </button>

              <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-bold text-zinc-100">{profile?.username || 'Utilisateur Elite'}</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Membre Premium</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-amber-200 to-amber-500 p-px">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
                    <User className="h-6 w-6 text-amber-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {error && <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-full space-y-12 lg:col-span-8">
            <section className="animate-fade-in">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-zinc-100">
                  <CreditCard className="h-5 w-5 text-amber-300" />
                  Votre Carte Elite
                </h2>
                <button className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200 transition-colors hover:text-amber-100">
                  Gérer les limites
                </button>
              </div>

              <div className="group relative flex h-64 cursor-pointer flex-col justify-between overflow-hidden rounded-4xl border border-white/15 bg-[linear-gradient(135deg,rgba(245,225,146,0.96),rgba(168,134,58,0.9))] p-10 text-black shadow-[0_32px_90px_-20px_rgba(0,0,0,0.95)] transition-all duration-500 hover:-translate-y-1 hover:rotate-[-0.5deg] hover:scale-[1.01]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.5),transparent_30%),url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />

                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-black/60">Solde Disponible</div>
                    <div className="text-5xl font-black tracking-tighter">{(wallet?.balance || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black italic">VISA</div>
                    <div className="mt-1 text-[10px] font-bold uppercase text-black/40">Platinum Elite</div>
                  </div>
                </div>

                <div className="relative z-10 flex items-end justify-between">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-4 font-mono text-2xl tracking-[0.25em] text-black/80">
                      <span>{wallet?.accountNumber ? wallet.accountNumber.replace(/(.{4})/g, '$1 ').trim() : 'SW-0000-0000'}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          copyAccountNumber()
                        }}
                        className="rounded-xl border border-black/10 bg-black/10 p-2 text-black transition-all hover:bg-black/20 active:scale-95"
                        title="Copier le numéro"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex gap-8">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/40">Titulaire</p>
                        <p className="text-sm font-bold uppercase text-black">{profile?.username || 'Utilisateur Elite'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/40">Expire</p>
                        <p className="text-sm font-bold text-black">05/28</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex h-12 w-16 items-center justify-center rounded-lg border border-white/10 bg-linear-to-br from-zinc-800 to-black shadow-inner">
                    <div className="h-8 w-10 rounded border border-white/20 opacity-20" />
                  </div>
                </div>

                <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20 blur-3xl transition-colors duration-700 group-hover:bg-white/30" />
                <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-black/10 blur-2xl" />
              </div>
            </section>

            <section className="animate-fade-in grid grid-cols-1 gap-6 md:grid-cols-3" style={{ animationDelay: '0.15s' }}>
              {stats.map((stat) => (
                <div key={stat.title} className="group rounded-[28px] border border-white/8 bg-black/30 p-6 backdrop-blur-md transition-all duration-300 hover:border-amber-300/30">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-2xl bg-white/5 p-3 transition-colors group-hover:bg-amber-300/10">
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stat.trend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                      {Math.abs(stat.trend)}%
                    </div>
                  </div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-zinc-100">{stat.value.toLocaleString('fr-FR')} €</p>
                </div>
              ))}
            </section>

            <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="rounded-4xl border border-white/8 bg-black/30 p-8 backdrop-blur-md">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-100">Analyses de Flux</h2>
                    <p className="mt-1 text-sm text-zinc-400">Performance des 30 derniers jours</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Profit Net</p>
                      <p className="text-xl font-black text-amber-200">+ 340,50 €</p>
                    </div>
                    <div className="h-12 w-px bg-white/10" />
                    <button className="rounded-xl bg-white/5 p-2 transition-colors hover:bg-white/10">
                      <TrendingUp className="h-5 w-5 text-amber-300" />
                    </button>
                  </div>
                </div>

                <div className="mb-12 h-62.5 w-full">
                  <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none" className="overflow-visible">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#0b0a09" stopOpacity="0" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {[0, 75, 150, 225, 300].map((y) => (
                      <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    ))}

                    <path d="M0 300 L0 220 Q 100 200, 200 240 T 400 180 T 600 220 T 800 150 T 1000 180 L 1000 300 Z" fill="url(#chartGradient)" className="animate-pulse duration-4000" />

                    <path
                      d="M0 220 Q 100 200, 200 240 T 400 180 T 600 220 T 800 150 T 1000 180"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#glow)"
                    />

                    {[200, 400, 600, 800].map((x, index) => (
                      <circle
                        key={x}
                        cx={x}
                        cy={[240, 180, 220, 150][index]}
                        r="6"
                        fill="#f59e0b"
                        className="animate-bounce"
                        style={{ animationDelay: `${index * 0.5}s`, animationDuration: '3s' }}
                      />
                    ))}
                  </svg>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <h4 className="flex items-center gap-2 font-bold text-zinc-100">
                      <PieChart className="h-4 w-4 text-amber-300" />
                      Répartition des Dépenses
                    </h4>
                    <div className="space-y-5">
                      {[
                        { label: 'Alimentation & Restauration', value: 45, color: '#fcd34d' },
                        { label: 'Loisirs & Style de vie', value: 30, color: '#fbbf24' },
                        { label: 'Transport & Mobilité', value: 15, color: '#f59e0b' }
                      ].map((category) => (
                        <div key={category.label} className="group cursor-default">
                          <div className="mb-2 flex justify-between text-xs">
                            <span className="text-zinc-400 transition-colors group-hover:text-zinc-100">{category.label}</span>
                            <span className="font-black text-zinc-100">{category.value}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                            <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${category.value}%`, backgroundColor: category.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-[28px] border border-amber-300/10 bg-amber-300/5 p-8 backdrop-blur-md">
                    <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                      <TrendingUp className="h-20 w-20 text-amber-300" />
                    </div>
                    <div className="relative z-10">
                      <h4 className="mb-2 font-bold text-zinc-100">Insight Elite</h4>
                      <p className="mb-6 text-sm leading-relaxed text-zinc-400">
                        Félicitations ! Vos dépenses ont diminué de <span className="font-bold text-amber-200">12%</span> par rapport au mois dernier.
                        Vous êtes sur la voie d'une croissance patrimoniale exceptionnelle.
                      </p>
                      <button className="flex items-center gap-2 text-sm font-bold text-amber-300 transition-all group-hover:gap-3">
                        Voir le rapport détaillé
                        <ArrowRightLeft className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="col-span-full space-y-12 lg:col-span-4">
            <aside className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="rounded-4xl border border-white/8 bg-black/30 p-8 backdrop-blur-md">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-100">
                    <ArrowRightLeft className="h-5 w-5 text-amber-300" />
                    Transfert Rapide
                  </h3>
                </div>
                <TransferForm onTransferSuccess={loadData} />
              </div>
            </aside>

            <section className="animate-fade-in" style={{ animationDelay: '0.35s' }}>
              <div className="min-h-125 rounded-4xl border border-white/8 bg-black/30 p-8 backdrop-blur-md">
                <div className="mb-10 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-100">
                    <History className="h-5 w-5 text-amber-300" />
                    Flux Récents
                  </h3>
                  <button className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200 transition-colors hover:text-amber-100">
                    Tout voir
                  </button>
                </div>
                <TransactionsList transactions={transactions} currentAccountNumber={wallet?.accountNumber} />
              </div>
            </section>

            <div className="animate-fade-in group relative overflow-hidden rounded-4xl border border-amber-300/20 bg-linear-to-br from-[#161514] to-black p-8" style={{ animationDelay: '0.5s' }}>
              <div className="absolute right-0 top-0 h-32 w-32 bg-amber-300/10 blur-[60px] transition-colors group-hover:bg-amber-300/20" />
              <div className="relative z-10">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300/10">
                  <TrendingUp className="h-5 w-5 text-amber-300" />
                </div>
                <h4 className="mb-2 text-lg font-bold text-zinc-100">Passez au niveau Supérieur</h4>
                <p className="mb-6 text-sm text-zinc-400">Accédez à des taux d'intérêt exclusifs et un conseiller dédié 24/7.</p>
                <button className="w-full rounded-2xl bg-amber-300 py-4 font-black text-black transition-all hover:bg-amber-400 active:scale-95">
                  UPGRADE MAINTENANT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage