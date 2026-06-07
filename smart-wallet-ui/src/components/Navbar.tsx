import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Search, Sun, Moon, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const { logout, user, notifications, unreadCount, markAllAsRead, clearNotifications } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [isLightMode, setIsLightMode] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('light-theme'),
  )

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

  const getInitials = () => {
    if (user?.fullName) {
      const parts = user.fullName.split(' ').filter(Boolean)
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
      return parts[0].substring(0, 2).toUpperCase()
    }
    if (user?.username) return user.username.substring(0, 2).toUpperCase()
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

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications((prev) => !prev)
                markAllAsRead()
              }}
              className="relative rounded-full border border-white/10 bg-white/5 p-2.5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-amber-200"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-[#0b0a09] bg-amber-400 animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-black/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-300">Notifications</span>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[10px] font-medium tracking-wide text-zinc-500 hover:text-rose-400 transition-colors"
                    >
                      Effacer tout
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2.5 pr-0.5">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-zinc-600 font-light select-none">
                      Aucune notification pour le moment.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`flex gap-3 rounded-xl p-3 border border-white/5 bg-white/[0.01] transition-all hover:bg-white/[0.04] ${
                          notif.read ? 'opacity-60' : 'border-amber-500/20 bg-amber-500/[0.02]'
                        }`}
                      >
                        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          notif.type === 'success'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {notif.type === 'success' ? '⊕' : '⊖'}
                        </span>
                        <div className="space-y-0.5 flex-1">
                          <p className="text-xs font-semibold text-zinc-200 leading-none">{notif.title}</p>
                          <p className="text-[11px] text-zinc-400 leading-normal mt-1">{notif.message}</p>
                          <p className="text-[9px] text-zinc-600 font-light mt-1">
                            {new Date(notif.timestamp).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1 pr-4 transition-all hover:bg-white/10 hover:border-white/20"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover border border-white/20" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-amber-200 to-amber-500 text-xs font-bold text-zinc-950 shadow-inner">
                {getInitials()}
              </div>
            )}
            <span className="hidden text-sm font-medium text-white/90 sm:block">
              {user?.fullName?.split(' ')[0] || user?.username || 'Profil'}
            </span>
          </button>

          <button
            onClick={logout}
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
