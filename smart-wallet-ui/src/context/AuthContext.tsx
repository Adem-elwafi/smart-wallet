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
  loginSuccess: (token: string) => Promise<void>
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
        api.get<WalletResponse>('/wallet/me'),
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
    }),
    [user, wallet, isAuthenticated, loading, loginSuccess, refreshUserData, logout],
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