import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'

type AuthLayoutProps = {
  badge: string
  title: string
  description: string
  highlights: string[]
  children: ReactNode
}

function AuthLayout({ badge, title, description, highlights, children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0a09] text-zinc-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(250,204,21,0.12),transparent_24%),radial-gradient(circle_at_82%_30%,rgba(255,255,255,0.05),transparent_24%),radial-gradient(circle_at_65%_86%,rgba(250,204,21,0.08),transparent_28%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-48 bg-linear-to-b from-white/5 to-transparent" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-stretch lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between border-b border-white/5 px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12">
          <div className="flex items-center gap-2.5">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
              <Sparkles className="h-6 w-6 text-zinc-950" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">
              Smart<span className="text-amber-300">Wallet</span>
            </span>
          </div>

          <div className="mx-auto w-full max-w-xl py-14 lg:py-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              {badge}
            </div>

            <h1 className="mt-7 max-w-lg text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-zinc-400 sm:text-lg">
              {description}
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm leading-6 text-zinc-400 backdrop-blur-md"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-zinc-500">© 2026 SmartWallet. All rights reserved.</div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </div>
  )
}

export default AuthLayout