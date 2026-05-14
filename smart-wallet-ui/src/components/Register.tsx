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
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
            <div className="mb-8 space-y-2 text-left">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Register</p>
                <h2 className="text-3xl font-semibold tracking-tight text-text-primary">Create account</h2>
                <p className="text-sm leading-6 text-text-secondary">
                    Set up your SmartWallet profile and start managing your finances in one place.
                </p>
            </div>

            {error && (
                <div className="mb-5 rounded-2xl border border-error bg-error-light px-4 py-3 text-sm text-error-dark">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block space-y-2 text-left">
                    <span className="text-sm font-medium text-text-secondary">Nom d'utilisateur</span>
                    <input
                        name="username"
                        type="text"
                        value={formData.username}
                        required
                        className="w-full rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-accent focus:bg-surface-elevated focus:ring-4 focus:ring-accent/15"
                        placeholder="adem_dev"
                        onChange={handleChange}
                    />
                </label>

                <label className="block space-y-2 text-left">
                    <span className="text-sm font-medium text-text-secondary">Adresse email</span>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        required
                        className="w-full rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-accent focus:bg-surface-elevated focus:ring-4 focus:ring-accent/15"
                        placeholder="nom@exemple.com"
                        onChange={handleChange}
                    />
                </label>

                <label className="block space-y-2 text-left">
                    <span className="text-sm font-medium text-text-secondary">Mot de passe</span>
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        required
                        className="w-full rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-accent focus:bg-surface-elevated focus:ring-4 focus:ring-accent/15"
                        placeholder="••••••••"
                        onChange={handleChange}
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-2xl bg-text-primary px-4 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? 'Traitement...' : "S'inscrire"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
                Déjà un compte ?{' '}
                <Link to="/login" className="font-semibold text-primary transition hover:text-primary hover:underline">
                    Se connecter
                </Link>
            </p>
        </div>
    )
}

export default Register