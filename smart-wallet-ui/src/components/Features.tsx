import { BarChart3, Shield, Zap } from 'lucide-react'
import type { ComponentType } from 'react'

type FeatureItem = {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
}

const featureItems: FeatureItem[] = [
  {
    icon: Shield,
    title: 'Securite JWT',
    description:
      'Authentification robuste basee sur JWT avec protection de bout en bout pour vos donnees financieres.',
  },
  {
    icon: Zap,
    title: 'Transferts SW-XXXX',
    description:
      "Envoyez de l'argent en quelques secondes grace au format de compte unique SmartWallet SW-XXXX.",
  },
  {
    icon: BarChart3,
    title: 'Analytics intelligents',
    description:
      'Suivez vos flux financiers en temps reel avec des indicateurs clairs et actionnables.',
  },
]

function Features() {
  return (
    <section className="py-2">
      <div className="grid gap-4 md:grid-cols-3">
        {featureItems.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="group rounded-3xl border border-white/8 bg-white/3 p-7 shadow-[0_18px_55px_-25px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/25 hover:bg-white/5"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200/15 bg-amber-200/10 text-amber-200 transition-colors group-hover:bg-amber-200/15">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-50">{title}</h3>
            <p className="mt-3 leading-relaxed text-zinc-400">{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Features