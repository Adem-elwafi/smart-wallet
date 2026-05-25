import { Check } from 'lucide-react'

type StepItem = {
  id: string
  title: string
  description: string
}

const steps: StepItem[] = [
  {
    id: '01',
    title: 'Inscription rapide',
    description: 'Creez votre compte en moins de deux minutes avec une verification simple.',
  },
  {
    id: '02',
    title: 'Creation de Wallet',
    description:
      'Votre wallet numerique est initialise automatiquement avec votre compte SmartWallet.',
  },
  {
    id: '03',
    title: 'Transactions instantanees',
    description:
      "Envoyez, recevez et suivez votre argent en temps reel depuis un tableau de bord unique.",
  },
]

function HowItWorks() {
  return (
    <section className="py-2">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-medium tracking-[0.35em] text-amber-200 uppercase">How It Works</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tighter text-zinc-50 md:text-5xl">
            Three steps to a polished SmartWallet experience.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-400">
            The flow is intentionally simple: sign up, create your wallet, and start moving money from a premium interface.
          </p>

          <div className="mt-10 space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="group relative rounded-3xl border border-white/8 bg-white/3 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200/25 hover:bg-white/5"
              >
                {index < steps.length - 1 ? (
                  <span className="pointer-events-none absolute -bottom-4 left-6 h-4 w-px bg-white/10" />
                ) : null}

                <div className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-200/15 bg-amber-200/10 text-sm font-semibold text-amber-100 transition-colors group-hover:border-amber-200/40">
                    {step.id}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-50">{step.title}</h3>
                    <p className="mt-1 text-zinc-400">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-4xl border border-white/8 bg-black/25 p-1 backdrop-blur-md">
          <div className="flex aspect-square items-center justify-center rounded-[28px] border border-white/8 bg-[linear-gradient(135deg,rgba(250,204,21,0.08),rgba(255,255,255,0.02))]">
            <div className="text-center">
              <div className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full border border-amber-200/20 bg-amber-200/10 text-amber-100">
                <Check className="h-10 w-10" />
              </div>
              <p className="text-2xl font-semibold text-zinc-50">Ready in one click</p>
              <p className="mt-2 text-zinc-400">Configuration completed to 100%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks