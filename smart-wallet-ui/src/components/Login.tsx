import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosConfig'
import type { AuthResponse } from '../api/types'

function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await api.post<AuthResponse>('/v1/auth/authenticate', credentials)
            localStorage.setItem('token', response.data.token)
            alert('Connexion réussie !')
        } catch (error) {
            console.error('Erreur de connexion', error)
            alert('Identifiants invalides')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="rounded-3xl border border-white/10 bg-white/95 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
            <div className="mb-8 space-y-2 text-left">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-600">Login</p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Sign in</h2>
                <p className="text-sm leading-6 text-slate-600">
                    Use your SmartWallet credentials to reach your dashboard.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block space-y-2 text-left">
                    <span className="text-sm font-medium text-slate-700">Nom d&apos;utilisateur</span>
                    <input
                        type="text"
                        value={credentials.username}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/15"
                        placeholder="adem_dev"
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    />
                </label>

                <label className="block space-y-2 text-left">
                    <span className="text-sm font-medium text-slate-700">Mot de passe</span>
                    <input
                        type="password"
                        value={credentials.password}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/15"
                        placeholder="••••••••"
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                </label>

                <button
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
                Pas encore de compte ?{' '}
                <Link to="/register" className="font-semibold text-sky-700 transition hover:text-sky-800 hover:underline">
                    Créer un compte
                </Link>
            </p>
        </div>
    )
}

export default Login