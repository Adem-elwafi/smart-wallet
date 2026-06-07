import axios from 'axios'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import type { Profile, Wallet } from '../api/types'
import { useWebSocket } from '../hooks/useWebSocket'

export interface AppNotification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
  type: 'info' | 'success' | 'warning' | 'danger'
}

type AuthContextValue = {
  user: Profile | null
  wallet: Wallet | null
  isAuthenticated: boolean
  loading: boolean
  loginSuccess: (token: string) => Promise<void>
  refreshUserData: () => Promise<void>
  logout: () => void
  notifications: AppNotification[]
  unreadCount: number
  markAllAsRead: () => void
  clearNotifications: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<Profile | null>(null)
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const [notifications, setNotifications] = useState<AppNotification[]>([])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => (n.read ? n : { ...n, read: true })))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Activation du WebSocket en temps réel
  useWebSocket({
    enabled: isAuthenticated && !!user,
    username: user?.username,
    token: localStorage.getItem('token') || undefined,
    onWalletUpdate: (newWallet) => {
      setWallet((prevWallet) => {
        if (prevWallet && prevWallet.balance !== newWallet.balance) {
          const diff = newWallet.balance - prevWallet.balance
          const isGain = diff > 0
          const absoluteDiff = Math.abs(diff).toLocaleString('fr-FR', { minimumFractionDigits: 2 })
          const title = isGain ? 'Fonds Reçus' : 'Compte Débité'
          const message = isGain
            ? `Virement entrant de +${absoluteDiff} € reçu.`
            : `Virement sortant de -${absoluteDiff} € effectué.`

          const newNotif: AppNotification = {
            id: Math.random().toString(36).substring(2, 9),
            title,
            message,
            timestamp: new Date(),
            read: false,
            type: isGain ? 'success' : 'info',
          }

          setNotifications((prev) => [newNotif, ...prev])

          // Play a premium sound effect
          try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav')
            audio.volume = 0.4
            void audio.play()
          } catch (e) {
            console.log('Audio playback error', e)
          }
        }
        return newWallet
      })
    },
  })

  const clearSession = useCallback(() => {
    setUser(null)
    setWallet(null)
    setIsAuthenticated(false)
    delete api.defaults.headers.common.Authorization
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    clearSession()
    setLoading(false)
    navigate('/login', { replace: true })
  }, [clearSession, navigate])

  const applyToken = useCallback((token: string) => {
    localStorage.setItem('token', token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  }, [])

  const refreshUserData = useCallback(async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      clearSession()
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const [profileResult, walletResult] = await Promise.allSettled([
        api.get<Profile>('/v1/profile/me'),
        api.get<Wallet>('/v1/wallet/me'),
      ])

      if (profileResult.status === 'fulfilled') {
        setUser(profileResult.value.data)
      }

      if (walletResult.status === 'fulfilled') {
        setWallet(walletResult.value.data)
      }

      const rejectedReasons = [profileResult, walletResult]
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .map((result) => result.reason)

      if (rejectedReasons.some((rejection) => axios.isAxiosError(rejection) && rejection.response?.status === 401)) {
        localStorage.removeItem('token')
        clearSession()
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token')
      }

      clearSession()
    } finally {
      setLoading(false)
    }
  }, [clearSession])

  const loginSuccess = useCallback(async (token: string) => {
    applyToken(token)
    setIsAuthenticated(true)

    try {
      await refreshUserData()
    } catch {
      // Keep the authenticated state if one bootstrap call races/fails during login.
      setIsAuthenticated(true)
    }
  }, [applyToken, refreshUserData])

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      clearSession()
      setLoading(false)
      return
    }

    void refreshUserData().catch(() => undefined)
  }, [clearSession, refreshUserData])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      wallet,
      isAuthenticated,
      loading,
      loginSuccess,
      refreshUserData,
      logout,
      notifications,
      unreadCount,
      markAllAsRead,
      clearNotifications,
    }),
    [
      user,
      wallet,
      isAuthenticated,
      loading,
      loginSuccess,
      refreshUserData,
      logout,
      notifications,
      unreadCount,
      markAllAsRead,
      clearNotifications,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}