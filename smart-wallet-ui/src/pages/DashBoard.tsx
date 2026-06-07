import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowRightLeft,
  CreditCard,
  Copy,
  History,
  PieChart,
  TrendingDown,
  Cpu,
  TrendingUp,
  X,
} from 'lucide-react'
import axios from 'axios'
import TransactionsList from '../components/TransactionsList'
import TransferForm from '../components/TransferForm'
import { getTransactionHistory } from '../services/transaction.service'
import StatCard from '../components/StatCard'
import { getDashboardChart, getDashboardStats } from '../services/analytics.service'
import type { ChartDataPoint, DashboardStatsResponse, TransactionResponse } from '../api/types'
import { useAuth } from '../context/AuthContext'

function DashboardPage() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [txLoading, setTxLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsResponse | null>(null)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [error, setError] = useState<string | null>(null)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const { user, wallet, loading: sessionLoading, logout } = useAuth()

  const loadData = useCallback(async () => {
    setTxLoading(true)
    setError(null)

    try {
      const txData = await getTransactionHistory()
      setTransactions(txData)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          logout()
          return
        }

        setError('Impossible de charger les données du dashboard.')
      } else {
        setError('Une erreur inattendue est survenue.')
      }
    } finally {
      setTxLoading(false)
    }
  }, [logout])

  useEffect(() => {
    queueMicrotask(() => {
      void loadData()
    })
  }, [loadData])

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true)
    setAnalyticsError(null)

    try {
      const [statsData, chartSeries] = await Promise.all([
        getDashboardStats(),
        getDashboardChart(),
      ])

      setDashboardStats(statsData)
      setChartData(chartSeries)
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        logout()
        return
      }

      setAnalyticsError('Impossible de charger les analyses financières.')
    } finally {
      setAnalyticsLoading(false)
    }
  }, [logout])

  useEffect(() => {
    queueMicrotask(() => {
      void loadAnalytics()
    })
  }, [loadAnalytics])

  const copyAccountNumber = () => {
    if (wallet?.accountNumber) {
      navigator.clipboard.writeText(wallet.accountNumber)
    }
  }

  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    [],
  )

  const formatMoney = (value: number) => `${currencyFormatter.format(value)} €`

  const chartPath = useMemo(() => {
    if (chartData.length === 0) {
      return ''
    }

    const width = 1000
    const height = 300
    const paddingX = 48
    const paddingY = 24
    const values = chartData.map((point) => Number(point.amount))
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const range = Math.max(maxValue - minValue, 1)
    const usableWidth = width - paddingX * 2
    const usableHeight = height - paddingY * 2

    const points = chartData.map((point, index) => {
      const amount = Number(point.amount)
      const x = chartData.length === 1 ? width / 2 : paddingX + (usableWidth * index) / (chartData.length - 1)
      const normalized = (amount - minValue) / range
      const y = paddingY + (1 - normalized) * usableHeight
      return { x, y }
    })

    return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ')
  }, [chartData])

  const chartAreaPath = useMemo(() => {
    if (chartData.length === 0) {
      return ''
    }

    const width = 1000
    const height = 300
    const paddingX = 48
    const paddingY = 24
    const values = chartData.map((point) => Number(point.amount))
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const range = Math.max(maxValue - minValue, 1)
    const usableWidth = width - paddingX * 2
    const usableHeight = height - paddingY * 2

    const points = chartData.map((point, index) => {
      const amount = Number(point.amount)
      const x = chartData.length === 1 ? width / 2 : paddingX + (usableWidth * index) / (chartData.length - 1)
      const normalized = (amount - minValue) / range
      const y = paddingY + (1 - normalized) * usableHeight
      return { x, y }
    })

    const first = points[0]
    const last = points[points.length - 1]

    return `M ${first.x.toFixed(2)} 300 L ${points.map((point) => `${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' L ')} L ${last.x.toFixed(2)} 300 Z`
  }, [chartData])

  const revenueTrendData = chartData.map((point) => Number(point.amount))
  const expensesTrendData = chartData.map((point, index) => Math.max(0, chartData.length - index) + Number(point.amount) * 0.15)
  const savingsTrendData = chartData.map((point, index) => Number(point.amount) - (index * 4))

  const stats = dashboardStats ?? {
    totalRevenues: 0,
    totalExpenses: 0,
    totalSavings: 0,
    revenuesTrend: 0,
    expensesTrend: 0,
    savingsTrend: 0,
  }

  if (sessionLoading || (txLoading && transactions.length === 0)) {
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
    <div className="relative min-h-screen overflow-hidden bg-[#0b0a09] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.08),transparent_28%),linear-gradient(180deg,#090807_0%,#0b0a09_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/40 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8 lg:pt-6">
        {(error || analyticsError) && (
          <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error || analyticsError}
          </div>
        )}

        <main className="grid grid-cols-12 gap-8">
          <section className="col-span-full lg:col-span-8">
            <div className="space-y-8">
              <article className="rounded-4xl border border-white/5 bg-zinc-900/40 p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-md sm:p-10">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-500">Primary balance</p>
                    <h2 className="mt-2 flex items-center gap-2 text-xl font-bold text-zinc-100 sm:text-2xl">
                      <CreditCard className="h-5 w-5 text-amber-300" />
                      Votre Carte Elite
                    </h2>
                  </div>
                  <button className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200 transition-colors hover:text-amber-100">
                    Gérer
                  </button>
                </div>

                <div className="relative overflow-hidden rounded-[28px] border border-white/5 bg-[linear-gradient(135deg,rgba(245,225,146,0.96),rgba(168,134,58,0.9))] p-8 text-black shadow-[0_32px_90px_-20px_rgba(0,0,0,0.95)] transition-transform duration-500 hover:-translate-y-1 sm:p-10">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.45),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.06),transparent_28%)]" />

                  <div className="relative z-10 flex items-start justify-between gap-6">
                    <div>
                      <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-black/60">Solde Disponible</div>
                      <div className="text-4xl font-black tracking-tighter sm:text-5xl">
                        {(wallet?.balance || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black italic">VISA</div>
                      <div className="mt-1 text-[10px] font-bold uppercase text-black/40">Platinum Elite</div>
                    </div>
                  </div>

                  <div className="relative z-10 mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-center gap-4 font-mono text-xl tracking-[0.25em] text-black/80 sm:text-2xl">
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
                          <p className="text-sm font-bold uppercase text-black">{user?.username || 'Utilisateur Elite'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/40">Expire</p>
                          <p className="text-sm font-bold text-black">05/28</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center rounded-2xl border border-black/10 bg-black/10 px-4 py-3">
                      <div className="flex h-12 w-16 items-center justify-center rounded-lg border border-amber-400/20 bg-[linear-gradient(135deg,rgba(255,248,214,0.95),rgba(184,145,65,0.95))] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                        <Cpu className="h-6 w-6 text-zinc-950/70" />
                      </div>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20 blur-3xl transition-colors duration-700 hover:bg-white/30" />
                </div>
              </article>

              <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {analyticsLoading && !dashboardStats ? (
                  [0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="h-56 animate-pulse rounded-3xl border border-white/5 bg-zinc-900/40 p-6 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.85)] backdrop-blur-md"
                    >
                      <div className="mb-4 h-10 w-10 rounded-2xl bg-white/5" />
                      <div className="mb-3 h-3 w-24 rounded-full bg-white/5" />
                      <div className="mb-8 h-8 w-36 rounded-full bg-white/5" />
                      <div className="h-10 rounded-full bg-white/5" />
                    </div>
                  ))
                ) : (
                  <>
                    <StatCard
                      title="Revenus ce mois"
                      value={formatMoney(stats.totalRevenues)}
                      trend={stats.revenuesTrend}
                      data={revenueTrendData}
                      delay="0.05s"
                      icon={TrendingUp}
                    />
                    <StatCard
                      title="Dépenses"
                      value={formatMoney(stats.totalExpenses)}
                      trend={stats.expensesTrend}
                      data={expensesTrendData}
                      delay="0.1s"
                      icon={TrendingDown}
                    />
                    <StatCard
                      title="Économies"
                      value={formatMoney(stats.totalSavings)}
                      trend={stats.savingsTrend}
                      data={savingsTrendData}
                      delay="0.15s"
                      icon={PieChart}
                    />
                  </>
                )}
              </section>

              <section className="rounded-4xl border border-white/5 bg-zinc-900/40 p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-md sm:p-10">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-500">Analytics</p>
                    <h2 className="mt-2 text-2xl font-bold text-zinc-100">Analyses de Flux</h2>
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

                <div className="mb-10 h-62.5 w-full">
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

                    {chartAreaPath && (
                      <path d={chartAreaPath} fill="url(#chartGradient)" className="animate-pulse duration-4000" />
                    )}

                    {chartPath && (
                      <path
                        d={chartPath}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                      />
                    )}

                    {chartData.length > 0 && (
                      <circle
                        cx={chartData.length === 1 ? 500 : 1000 - 48}
                        cy={(() => {
                          const amount = Number(chartData[chartData.length - 1].amount)
                          const values = chartData.map((point) => Number(point.amount))
                          const minValue = Math.min(...values)
                          const maxValue = Math.max(...values)
                          const range = Math.max(maxValue - minValue, 1)
                          const normalized = (amount - minValue) / range
                          return 24 + (1 - normalized) * 252
                        })()}
                        r="6"
                        fill="#f59e0b"
                        className="animate-bounce"
                        style={{ animationDuration: '3s' }}
                      />
                    )}
                  </svg>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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

                  <div className="rounded-[28px] border border-amber-300/10 bg-amber-300/5 p-8 backdrop-blur-md">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300/10">
                      <TrendingUp className="h-5 w-5 text-amber-300" />
                    </div>
                    <h4 className="mb-2 font-bold text-zinc-100">Insight Elite</h4>
                    <p className="mb-6 text-sm leading-relaxed text-zinc-400">
                      Félicitations ! Vos dépenses ont diminué de <span className="font-bold text-amber-200">12%</span> par rapport au mois dernier.
                      Vous êtes sur la voie d'une croissance patrimoniale exceptionnelle.
                    </p>
                    <button className="flex items-center gap-2 text-sm font-bold text-amber-300 transition-all hover:gap-3">
                      Voir le rapport détaillé
                      <ArrowRightLeft className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </section>

          <aside className="col-span-full space-y-6 lg:col-span-4">
            <section className="rounded-4xl border border-white/5 bg-zinc-900/40 p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-md">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-100">
                  <ArrowRightLeft className="h-5 w-5 text-amber-300" />
                  Transfert Rapide
                </h3>
              </div>
              <TransferForm onTransferSuccess={loadData} />
            </section>

            <section className="rounded-4xl border border-white/5 bg-zinc-900/40 p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-md">
              <div className="mb-10 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-100">
                  <History className="h-5 w-5 text-amber-300" />
                  Flux Récents
                </h3>
                <button 
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="text-xs font-bold uppercase tracking-[0.3em] text-amber-200 transition-colors hover:text-amber-100"
                >
                  Tout voir
                </button>
              </div>
              <TransactionsList transactions={transactions.slice(0, 4)} currentAccountNumber={wallet?.accountNumber} />
            </section>

            <section className="overflow-hidden rounded-4xl border border-amber-300/20 bg-linear-to-br from-[#161514] to-black p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)]">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300/10">
                <TrendingUp className="h-5 w-5 text-amber-300" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-zinc-100">Passez au niveau Supérieur</h4>
              <p className="mb-6 text-sm text-zinc-400">Accédez à des taux d'intérêt exclusifs et un conseiller dédié 24/7.</p>
              <button className="w-full rounded-2xl bg-amber-300 py-4 font-black text-black transition-all hover:bg-amber-400 active:scale-95">
                UPGRADE MAINTENANT
              </button>
            </section>
          </aside>
        </main>
      </div>

      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg p-4">
          <div className="glass relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 p-6 shadow-2xl">
            <div className="sticky top-0 z-10 mb-8 flex items-center justify-between bg-zinc-900/40 py-2 backdrop-blur-xl">
              <h3 className="flex items-center gap-2 text-2xl font-bold text-zinc-100">
                <History className="h-6 w-6 text-amber-300" />
                Historique Complet
              </h3>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="rounded-xl bg-white/5 p-2 transition-colors hover:bg-white/10"
              >
                <X className="h-6 w-6 text-zinc-400" />
              </button>
            </div>
            <TransactionsList transactions={transactions} currentAccountNumber={wallet?.accountNumber} showControls={true} />
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage