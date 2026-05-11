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
        <div className="rounded-3xl border border-white/10 bg-white/95 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
            <div className="mb-8 space-y-2 text-left">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-600">Register</p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Create account</h2>
                <p className="text-sm leading-6 text-slate-600">
                    Set up your SmartWallet profile and start managing your finances in one place.
                </p>
            </div>

            {error && (
                <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block space-y-2 text-left">
                    <span className="text-sm font-medium text-slate-700">Nom d'utilisateur</span>
                    <input
                        name="username"
                        type="text"
                        value={formData.username}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/15"
                        placeholder="adem_dev"
                        onChange={handleChange}
                    />
                </label>

                <label className="block space-y-2 text-left">
                    <span className="text-sm font-medium text-slate-700">Adresse email</span>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/15"
                        placeholder="nom@exemple.com"
                        onChange={handleChange}
                    />
                </label>

                <label className="block space-y-2 text-left">
                    <span className="text-sm font-medium text-slate-700">Mot de passe</span>
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/15"
                        placeholder="••••••••"
                        onChange={handleChange}
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? 'Traitement...' : "S'inscrire"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
                Déjà un compte ?{' '}
                <Link to="/login" className="font-semibold text-sky-700 transition hover:text-sky-800 hover:underline">
                    Se connecter
                </Link>
            </p>
        </div>
    )
}

export default Register