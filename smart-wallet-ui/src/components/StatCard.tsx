import { type LucideIcon, TrendingDown, TrendingUp } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  trend: number
  data?: number[]
  delay?: string
  icon?: LucideIcon
}

function buildSparklinePath(values: number[]) {
  if (values.length < 2) {
    return 'M 0 20 L 100 20'
  }

  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const range = Math.max(maxValue - minValue, 1)

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100
      const y = 36 - ((value - minValue) / range) * 28
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

function StatCard({ title, value, trend, data = [30, 20, 25, 15, 30, 20, 10], delay = '0s', icon: Icon }: StatCardProps) {
  const isPositive = trend >= 0
  const sparklinePath = buildSparklinePath(data)

  return (
    <div
      className="group rounded-3xl border border-white/5 bg-zinc-900/40 p-6 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.85)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
      style={{ animationDelay: delay }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-2xl bg-white/5 p-3 text-amber-300">
          {Icon ? <Icon className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isPositive ? '+' : ''}{trend}%
        </div>
      </div>

      <p className="mb-1 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">{title}</p>
      <p className="mb-4 text-2xl font-bold text-zinc-100">{value}</p>

      <div className="h-10 w-full mt-auto">
        <svg viewBox="0 0 100 40" className="h-full w-full" preserveAspectRatio="none">
          <path
            d={sparklinePath}
            fill="none"
            stroke={isPositive ? '#f59e0b' : '#f43f5e'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500"
          />
        </svg>
      </div>
    </div>
  )
}

export default StatCard
