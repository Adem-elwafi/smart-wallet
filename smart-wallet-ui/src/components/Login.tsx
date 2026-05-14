import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import type { AuthResponse } from '../api/types'

function Login() {
    const navigate = useNavigate()
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await api.post<AuthResponse>('/v1/auth/authenticate', credentials)
            localStorage.setItem('token', response.data.token)
            alert('Connexion réussie !')
            navigate('/dashboard')
        } catch (error) {
            console.error('Erreur de connexion', error)
            alert('Identifiants invalides')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
            <div className="mb-8 space-y-2 text-left">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Login</p>
                <h2 className="text-3xl font-semibold tracking-tight text-text-primary">Sign in</h2>
                <p className="text-sm leading-6 text-text-secondary">
                    Use your SmartWallet credentials to reach your dashboard.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block space-y-2 text-left">
                    <span className="text-sm font-medium text-text-secondary">Nom d&apos;utilisateur</span>
                    <input
                        type="text"
                        value={credentials.username}
                        required
                        className="w-full rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-accent focus:bg-surface-elevated focus:ring-4 focus:ring-accent/15"
                        placeholder="adem_dev"
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    />
                </label>

                <label className="block space-y-2 text-left">
                    <span className="text-sm font-medium text-text-secondary">Mot de passe</span>
                    <input
                        type="password"
                        value={credentials.password}
                        required
                        className="w-full rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-accent focus:bg-surface-elevated focus:ring-4 focus:ring-accent/15"
                        placeholder="••••••••"
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                </label>

                <button
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-2xl bg-text-primary px-4 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
                Pas encore de compte ?{' '}
                <Link to="/register" className="font-semibold text-primary transition hover:text-primary hover:underline">
                    Créer un compte
                </Link>
            </p>
        </div>
    )
}

export default Login