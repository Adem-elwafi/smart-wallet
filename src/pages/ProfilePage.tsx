import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import api from '../api/axiosConfig'
import type { Profile, UpdateProfileRequest } from '../api/types'

function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    email: '',
    fullName: '',
    avatarUrl: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setError(null)
        const response = await api.get<Profile>('/profile/me')
        setProfile(response.data)
        setFormData({
          email: response.data.email || '',
          fullName: response.data.fullName || '',
          avatarUrl: response.data.avatarUrl || '',
        })
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(typeof err.response?.data === 'string' ? err.response.data : 'Impossible de charger le profil.')
        } else {
          setError('Une erreur inattendue est survenue.')
        }
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      const response = await api.put<Profile>('/profile/me', formData)
      setProfile(response.data)
      alert('Profil mis a jour.')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(typeof err.response?.data === 'string' ? err.response.data : 'Impossible de mettre a jour le profil.')
      } else {
        setError('Une erreur inattendue est survenue.')
      }
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Chargement profil...</div>
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Mon profil</h1>
          <Link to="/dashboard" className="text-sm font-semibold text-sky-700">Retour dashboard</Link>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {error && (
            <p className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          )}
          <p className="text-sm text-slate-600">Username: <span className="font-semibold text-slate-900">{profile?.username}</span></p>

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
              placeholder="Email"
            />
            <input
              name="fullName"
              value={formData.fullName}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
              placeholder="Nom complet"
            />
            <input
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
              placeholder="URL avatar"
            />
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Enregistrer</button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage
