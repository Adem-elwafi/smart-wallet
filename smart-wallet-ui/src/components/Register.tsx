import { ArrowRight, Loader2, Lock, Mail, Sparkles, User, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await api.post('/v1/auth/register', formData)
            navigate('/login')
        } catch (err: unknown) {
            const apiError = err as { response?: { data?: { message?: string } } }
            setError(apiError.response?.data?.message || "Une erreur est survenue lors de l'inscription.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="rounded-[28px] border border-white/8 bg-black/30 p-8 shadow-2xl shadow-black/40 backdrop-blur-md lg:p-10">
            <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-200">
                    <Sparkles className="h-3 w-3" />
                    Create your elite account
                </div>
                <h2 className="text-2xl font-semibold text-white">Registration</h2>
                <p className="mt-2 text-sm text-zinc-400">Join the ecosystem of premium financial tools.</p>
            </div>

            {error ? (
                <div className="mb-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                    {error}
                </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block space-y-2 text-left">
                    <span className="ml-1 text-xs font-medium uppercase tracking-widest text-zinc-400">Username</span>
                    <div className="group relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <User className="h-5 w-5 text-zinc-500 transition-colors group-focus-within:text-amber-300/70" />
                        </div>
                        <input
                            name="username"
                            type="text"
                            value={formData.username}
                            required
                            className="block w-full rounded-xl border border-white/8 bg-white/3 py-3 pl-11 pr-4 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-amber-300/50 focus:ring-1 focus:ring-amber-300/50"
                            placeholder="adem_dev"
                            onChange={handleChange}
                        />
                    </div>
                </label>

                <label className="block space-y-2 text-left">
                    <span className="ml-1 text-xs font-medium uppercase tracking-widest text-zinc-400">Email</span>
                    <div className="group relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <Mail className="h-5 w-5 text-zinc-500 transition-colors group-focus-within:text-amber-300/70" />
                        </div>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            required
                            className="block w-full rounded-xl border border-white/8 bg-white/3 py-3 pl-11 pr-4 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-amber-300/50 focus:ring-1 focus:ring-amber-300/50"
                            placeholder="nom@exemple.com"
                            onChange={handleChange}
                        />
                    </div>
                </label>

                <label className="block space-y-2 text-left">
                    <span className="ml-1 text-xs font-medium uppercase tracking-widest text-zinc-400">Password</span>
                    <div className="group relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <Lock className="h-5 w-5 text-zinc-500 transition-colors group-focus-within:text-amber-300/70" />
                        </div>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            required
                            className="block w-full rounded-xl border border-white/8 bg-white/3 py-3 pl-11 pr-4 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-amber-300/50 focus:ring-1 focus:ring-amber-300/50"
                            placeholder="••••••••"
                            onChange={handleChange}
                        />
                    </div>
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,rgba(250,204,21,0.95),rgba(202,138,4,0.95))] px-4 py-4 font-semibold text-zinc-950 shadow-[0_18px_40px_-15px_rgba(202,138,4,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-12px_rgba(202,138,4,0.55)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
                    <span>{loading ? 'Traitement...' : 'Create Account'}</span>
                    {!loading ? <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /> : null}
                </button>
            </form>

            <div className="mt-8 border-t border-white/5 pt-6 text-center text-sm text-zinc-500">
                <p>
                    Déjà un compte ?{' '}
                    <Link to="/login" className="font-medium text-amber-200 transition-colors hover:text-amber-100">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register