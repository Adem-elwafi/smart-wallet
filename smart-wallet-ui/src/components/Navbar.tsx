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
    <nav className="border-b border-border bg-surface-elevated shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 text-xl font-bold text-text-primary transition hover:text-accent"
          >
            <Wallet className="h-6 w-6 text-accent" />
            SmartWallet
          </button>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-medium text-text-secondary transition hover:text-text-primary"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="text-sm font-medium text-text-secondary transition hover:text-text-primary"
            >
              Profil
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-error-light px-4 py-2 text-sm font-medium text-error transition hover:bg-error hover:text-white"
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
