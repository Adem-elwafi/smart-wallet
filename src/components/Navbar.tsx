import { useNavigate } from 'react-router-dom'
import { LogOut, Wallet } from 'lucide-react'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  const handleLogoClick = () => {
    navigate('/dashboard')
  }

  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 text-xl font-bold text-slate-900 transition hover:text-sky-600"
          >
            <Wallet className="h-6 w-6 text-sky-600" />
            SmartWallet
          </button>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Profil
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
