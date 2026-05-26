import { ArrowRight, ChevronRight, LogIn, Sparkles, Wallet } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'

function HomePage() {
  const navigate = useNavigate()
  const hasToken = useMemo(() => Boolean(localStorage.getItem('token')), [])

  return (
    <div className="min-h-screen bg-[#0b0a09] text-zinc-100">
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px) rotateZ(-3deg) rotateY(-12deg); }
          50% { transform: translateY(-18px) rotateZ(-1deg) rotateY(-5deg); }
        }

        @keyframes driftGlow {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.45; }
          50% { transform: translate(18px, -12px) scale(1.04); opacity: 0.7; }
        }

        @keyframes sparklePulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.75; }
          50% { transform: scale(1.08) rotate(12deg); opacity: 1; }
        }
      `}</style>

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav className="mx-auto flex w-full max-w-350 items-center justify-between rounded-[22px] border border-white/10 bg-black/55 px-5 py-4 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl md:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/20 bg-[linear-gradient(135deg,rgba(202,138,4,0.95),rgba(250,204,21,0.7))] text-zinc-950 shadow-[0_10px_30px_rgba(202,138,4,0.25)]">
              <Wallet className="h-5 w-5" />
            </span>
            <span className="font-semibold tracking-[0.18em] text-amber-100 uppercase">SmartWallet</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium lg:flex">
            <a href="#services" className="text-zinc-400 transition-colors hover:text-amber-200">
              Service
            </a>
            <a href="#how-it-works" className="text-zinc-400 transition-colors hover:text-amber-200">
              How It Work
            </a>
            <a href="#benefits" className="text-zinc-400 transition-colors hover:text-amber-200">
              Benefits
            </a>
            <a href="#pricing" className="text-zinc-400 transition-colors hover:text-amber-200">
              Pricing
            </a>

            <button type="button" onClick={() => navigate('/login')} className="text-zinc-300 transition-colors hover:text-white">
              Log In
            </button>

            <button
              type="button"
              onClick={() => navigate('/register')}
              className="rounded-full border border-amber-300/40 px-5 py-2 text-amber-100 transition-all hover:border-amber-200 hover:bg-amber-200/10"
            >
              Sign Up
            </button>

            {hasToken ? (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="rounded-full bg-amber-300 px-5 py-2 font-medium text-zinc-950 transition-colors hover:bg-amber-200"
              >
                Dashboard
              </button>
            ) : null}
          </div>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 pb-16 pt-36 md:px-6 md:pb-24 md:pt-40">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(250,204,21,0.18),transparent_24%),radial-gradient(circle_at_82%_30%,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_70%_82%,rgba(161,98,7,0.18),transparent_28%)]" />

          <div className="mx-auto grid max-w-350 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-white/5 px-4 py-2 text-xs font-medium tracking-[0.25em] text-amber-100/80 uppercase backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-amber-200" />
                The New Standard of Wealth
              </div>

              <h1 className="max-w-[10ch] text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-zinc-50 md:text-7xl xl:text-[5.6rem]">
                Redefining
                <span className="block text-(--accent)">Financial Elite.</span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 md:text-lg">
                Experience the next generation of wealth management. Secure, elegant, and designed for people who want more than a basic banking app.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,rgba(250,204,21,0.95),rgba(202,138,4,0.95))] px-7 py-4 text-sm font-semibold tracking-wide text-zinc-950 shadow-[0_18px_50px_-15px_rgba(202,138,4,0.55)] transition-transform hover:-translate-y-0.5"
                >
                  Get It Now
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-semibold tracking-wide text-zinc-100 backdrop-blur-md transition-colors hover:border-amber-200/40 hover:bg-white/10"
                >
                  <LogIn className="h-4 w-4" />
                  Download App
                </button>
                {hasToken ? (
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center justify-center rounded-xl border border-amber-200/25 bg-amber-200/10 px-5 py-4 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-200/15"
                  >
                    Go to dashboard
                  </button>
                ) : null}
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-zinc-500">
                <div className="flex items-center gap-3 rounded-full border border-white/8 bg-white/5 px-4 py-2 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_16px_rgba(250,204,21,0.8)]" />
                  Trusted by 50,000+ users
                </div>
                <div className="flex items-center gap-3 rounded-full border border-white/8 bg-white/5 px-4 py-2 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-white/60" />
                  Instant transfers • Smart analytics • Premium security
                </div>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative h-130 w-full max-w-180 perspective-[1600px]">
                <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_65%_40%,rgba(250,204,21,0.16),transparent_25%),radial-gradient(circle_at_25%_75%,rgba(255,255,255,0.06),transparent_22%)]" />

                <div
                  className="absolute left-[7%] top-[58%] h-28 w-[82%] rounded-[999px] bg-[linear-gradient(180deg,rgba(187,140,61,0.92),rgba(63,41,11,0.92))] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)]"
                  style={{ transform: 'skewX(-10deg)' }}
                />

                <div
                  className="absolute left-[14%] top-[52%] h-24 w-[68%] rounded-[999px] bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.42),rgba(0,0,0,0)_70%)] blur-2xl"
                  style={{ animation: 'driftGlow 8s ease-in-out infinite' }}
                />

                <div
                  className="absolute left-[18%] top-[26%] h-50 w-80 rounded-[28px] border border-amber-200/30 bg-[linear-gradient(135deg,rgba(245,225,146,0.96),rgba(168,134,58,0.9))] shadow-[0_28px_70px_-22px_rgba(202,138,4,0.45)]"
                  style={{ transform: 'rotateY(-18deg) rotateZ(-8deg)', transformStyle: 'preserve-3d' }}
                >
                  <div className="flex h-full flex-col justify-between p-6 text-zinc-950">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-zinc-950/70">SmartWallet</p>
                        <p className="mt-2 text-lg font-semibold text-zinc-950">Premium Gold</p>
                      </div>
                      <div className="rounded-full border border-zinc-950/15 bg-white/20 px-3 py-1 text-[0.62rem] uppercase tracking-[0.28em] text-zinc-950/80">
                        Credit Card
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-11 w-15 rounded-lg border border-zinc-950/10 bg-[linear-gradient(135deg,rgba(255,248,214,0.95),rgba(184,145,65,0.95))] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]" />
                      <div>
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.42em] text-zinc-950/70">Card Number</p>
                        <p className="mt-2 font-mono text-lg tracking-[0.28em] text-zinc-950">1234 5678 9012 245</p>
                        <p className="mt-1 text-xs text-zinc-950/70">06/25</p>
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-950/70">Alex Mercer</p>
                        <p className="mt-1 text-sm text-zinc-950/75">Premium Account</p>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-950/80">
                        <span className="h-2 w-2 rounded-full bg-zinc-950" />
                        Active
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute left-[30%] top-[23%] h-55 w-82.5 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#161514,#080807)] p-6 shadow-[0_32px_90px_-20px_rgba(0,0,0,0.95)]"
                  style={{ animation: 'floatCard 7s ease-in-out infinite', transformStyle: 'preserve-3d' }}
                >
                  <div className="flex h-full flex-col justify-between overflow-hidden rounded-[20px] border border-white/5 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.08),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-zinc-500">SmartWallet</p>
                        <p className="mt-2 text-lg font-medium text-zinc-100">Elite Black</p>
                      </div>
                      <div className="rounded-full border border-amber-200/30 bg-amber-200/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-amber-100">
                        Visa
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-12 w-16 rounded-lg border border-amber-200/20 bg-[linear-gradient(135deg,rgba(252,211,77,0.92),rgba(180,140,60,0.9))] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]" />
                      <div>
                        <p className="font-mono text-[0.66rem] uppercase tracking-[0.4em] text-zinc-500">Card Number</p>
                        <p className="mt-2 font-mono text-lg tracking-[0.26em] text-zinc-100">4582 •••• •••• 8824</p>
                        <p className="mt-1 text-xs text-zinc-500">Elite Black</p>
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Alex Mercer</p>
                        <p className="mt-1 text-sm text-zinc-300">Premium Account</p>
                      </div>
                      <div className="flex items-center gap-2 text-amber-100/80">
                        <span className="h-2 w-2 rounded-full bg-amber-300" />
                        Active
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute left-[9%] top-[12%] text-amber-200/80" style={{ animation: 'sparklePulse 4.2s ease-in-out infinite' }}>
                  <ChevronRight className="h-6 w-6 -rotate-45" />
                </div>
                <div className="absolute right-[14%] top-[18%] text-amber-200/80" style={{ animation: 'sparklePulse 4.8s ease-in-out infinite' }}>
                  <ChevronRight className="h-5 w-5 rotate-45" />
                </div>

                <div className="absolute bottom-[15%] right-[8%] rounded-[18px] border border-white/8 bg-white/8 px-4 py-3 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-300 px-4 py-2 text-lg font-semibold text-zinc-950">1.24M</div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">World Active User</p>
                      <div className="mt-2 flex items-center -space-x-2">
                        <span className="h-9 w-9 rounded-full border-2 border-[#0b0a09] bg-linear-to-br from-zinc-300 to-zinc-500" />
                        <span className="h-9 w-9 rounded-full border-2 border-[#0b0a09] bg-linear-to-br from-zinc-400 to-zinc-700" />
                        <span className="h-9 w-9 rounded-full border-2 border-[#0b0a09] bg-linear-to-br from-amber-200 to-amber-500" />
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0b0a09] bg-zinc-100 text-sm font-semibold text-zinc-900">+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 md:px-6">
          <div className="mx-auto grid max-w-350 grid-cols-1 gap-4 border-t border-white/8 pt-8 md:grid-cols-3 xl:grid-cols-4">
            {[
              ['01', 'Financial Transaction', 'Manage everything from the wallet experience to daily transfers.'],
              ['02', 'Easy To Use System', 'Each card and wallet view is structured for clarity and speed.'],
              ['03', 'Secure by Design', 'JWT-backed security with a clean premium interface.'],
              ['04', 'Instant Insights', 'Monitor balances and activity in a single glance.'],
            ].map(([number, title, description]) => (
              <article key={number} className="rounded-[22px] border border-white/8 bg-white/3 p-5 backdrop-blur-md transition-transform hover:-translate-y-1">
                <div className="text-sm font-semibold tracking-[0.28em] text-amber-200">{number}</div>
                <h3 className="mt-3 text-lg font-semibold text-zinc-100">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="px-4 py-16 md:px-6">
          <div className="mx-auto max-w-350">
            <div className="mb-10 max-w-2xl">
              <p className="text-sm font-medium tracking-[0.35em] text-amber-200 uppercase">Service</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-zinc-50 md:text-5xl">Precision tools for modern wealth.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-zinc-400">
                SmartWallet brings together secure banking, rich analytics, and premium wallet experiences in one refined interface.
              </p>
            </div>

            <Features />
          </div>
        </section>

        <section id="how-it-works" className="px-4 py-8 md:px-6">
          <div className="mx-auto max-w-350">
            <HowItWorks />
          </div>
        </section>

        <section id="benefits" className="px-4 py-10 md:px-6">
          <div className="mx-auto grid max-w-350 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-4xl border border-white/8 bg-white/3 p-8 backdrop-blur-md md:p-10">
              <p className="text-sm font-medium tracking-[0.35em] text-amber-200 uppercase">Benefits</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tighter text-zinc-50 md:text-5xl">Unrivaled privileges.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                SmartWallet is built to feel premium, fast, and confident, with an interface that makes finance feel simple instead of heavy.
              </p>

              <div className="mt-10 space-y-6">
                {[
                  ['Global reach', 'Built for a borderless financial experience.'],
                  ['Concierge support', 'Fast, clean, and reassuring help when you need it.'],
                  ['Elite security', 'Strong authentication and protected flows by default.'],
                ].map(([title, description]) => (
                  <div key={title} className="flex gap-4 rounded-3xl border border-white/8 bg-black/20 p-5">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(250,204,21,0.75)]" />
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="pricing" className="rounded-4xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-8 backdrop-blur-md md:p-10">
              <p className="text-sm font-medium tracking-[0.35em] text-amber-200 uppercase">Pricing</p>
              <h3 className="mt-4 text-2xl font-semibold text-zinc-50">Simple premium access.</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                A clean starting point for users who want a polished, secure SmartWallet experience.
              </p>

              <div className="mt-8 rounded-[28px] border border-amber-200/15 bg-black/30 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Starter</p>
                    <div className="mt-3 flex items-end gap-2">
                      <span className="text-5xl font-semibold tracking-tighter text-zinc-50">$12</span>
                      <span className="mb-1 text-sm text-zinc-500">/ month</span>
                    </div>
                  </div>
                  <span className="rounded-full border border-amber-200/20 px-3 py-1 text-xs uppercase tracking-[0.28em] text-amber-100">Best Value</span>
                </div>

                <div className="mt-6 space-y-3 text-sm text-zinc-400">
                  <p>Premium wallet experience</p>
                  <p>Secure login and routing</p>
                  <p>Analytics-ready dashboard foundation</p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-amber-300 px-5 py-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-200"
                >
                  Start Now
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="px-4 pb-10 pt-12 md:px-6 md:pb-14">
          <div className="mx-auto max-w-350 rounded-4xl border border-white/8 bg-black/30 px-6 py-8 backdrop-blur-md md:px-8">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <Link to="/" className="flex items-center gap-2.5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 text-zinc-950">
                    <Wallet className="h-5 w-5" />
                  </span>
                  <span className="font-semibold tracking-[0.18em] text-amber-100 uppercase">SmartWallet</span>
                </Link>
                <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-500">
                  Redefining the boundaries of modern wealth management through elegant technology and a premium banking experience.
                </p>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-zinc-500">
                <a href="#services" className="transition-colors hover:text-amber-100">Services</a>
                <a href="#benefits" className="transition-colors hover:text-amber-100">Benefits</a>
                <a href="#pricing" className="transition-colors hover:text-amber-100">Pricing</a>
                <button type="button" onClick={() => navigate('/login')} className="transition-colors hover:text-amber-100">Log In</button>
                <button type="button" onClick={() => navigate('/register')} className="transition-colors hover:text-amber-100">Sign Up</button>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default HomePage