import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Search, Sun, Moon, Wallet, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../api/axiosConfig'
import type { Profile } from '../api/types'

function Navbar() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLightMode, setIsLightMode] = useState(false)

  // Initialize theme from HTML element on mount
  useEffect(() => {
    setIsLightMode(document.documentElement.classList.contains('light-theme'))
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    if (html.classList.contains('light-theme')) {
      html.classList.remove('light-theme')
      setIsLightMode(false)
    } else {
      html.classList.add('light-theme')
      setIsLightMode(true)
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get<Profile>('/v1/profile/me')
        setProfile(response.data)
      } catch (err) {
        console.error("Failed to fetch profile in navbar", err)
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  const handleLogoClick = () => {
    navigate('/dashboard')
  }

  const getInitials = () => {
    if (profile?.fullName) {
      const parts = profile.fullName.split(' ').filter(Boolean)
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
      return parts[0].substring(0, 2).toUpperCase()
    }
    if (profile?.username) return profile.username.substring(0, 2).toUpperCase()
    return 'US'
  }

  return (
    <header className="sticky top-4 z-50 px-4 pt-4">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-[22px] border border-white/10 bg-black/55 px-5 py-4 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl md:px-8">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/20 bg-[linear-gradient(135deg,rgba(202,138,4,0.95),rgba(250,204,21,0.7))] text-zinc-950 shadow-[0_10px_30px_rgba(202,138,4,0.25)]">
            <Wallet className="h-5 w-5" />
          </span>
          <span className="font-semibold tracking-[0.18em] text-amber-100 uppercase">SmartWallet</span>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Profile', to: '/profile' }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.to)}
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-amber-200"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search"
              className="w-48 rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-amber-300/50 focus:bg-white/8 lg:w-56"
            />
          </div>

          <button
            onClick={toggleTheme}
            className="rounded-full border border-white/10 bg-white/5 p-2.5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            title="Toggle Theme"
          >
            {isLightMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          <button className="relative rounded-full border border-white/10 bg-white/5 p-2.5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-amber-200" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#0b0a09] bg-amber-300" />
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1 pr-4 transition-all hover:bg-white/10 hover:border-white/20"
          >
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover border border-white/20" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-amber-200 to-amber-500 shadow-inner">
                <User className="h-4 w-4 text-zinc-950" />
              </div>
            )}
            <span className="hidden text-sm font-medium text-white/90 sm:block">
              {profile?.fullName?.split(' ')[0] || profile?.username || 'Profil'}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="hidden items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500 hover:text-white md:flex"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
