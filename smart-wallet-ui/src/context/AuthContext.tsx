import axios from 'axios'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import type { Profile, WalletResponse } from '../api/types'

type AuthContextValue = {
  user: Profile | null
  wallet: WalletResponse | null
  isAuthenticated: boolean
  loading: boolean
  refreshUserData: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<Profile | null>(null)
  const [wallet, setWallet] = useState<WalletResponse | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const clearSession = useCallback(() => {
    setUser(null)
    setWallet(null)
    setIsAuthenticated(false)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    clearSession()
    setLoading(false)
    navigate('/login', { replace: true })
  }, [clearSession, navigate])

  const refreshUserData = useCallback(async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      clearSession()
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const [profileResponse, walletResponse] = await Promise.all([
        api.get<Profile>('/v1/profile/me'),
        api.get<WalletResponse>('/wallet/me'),
      ])

      setUser(profileResponse.data)
      setWallet(walletResponse.data)
      setIsAuthenticated(true)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token')
      }

      clearSession()
      throw error
    } finally {
      setLoading(false)
    }
  }, [clearSession])

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
      refreshUserData,
      logout,
    }),
    [user, wallet, isAuthenticated, loading, refreshUserData, logout],
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