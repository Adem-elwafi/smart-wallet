import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import type { JSX } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/DashBoard'
import ProfilePage from './pages/ProfilePage'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import { AuthProvider, useAuth } from './context/AuthContext'

function RequireAuth({ children }: { children: JSX.Element }): JSX.Element {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-[#0b0a09]" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function RedirectIfAuthenticated({ children }: { children: JSX.Element }): JSX.Element {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-[#0b0a09]" />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Auth Pages - No Layout */}
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <LoginPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfAuthenticated>
                <RegisterPage />
              </RedirectIfAuthenticated>
            }
          />

          {/* Protected Routes - With Layout */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Layout>
                  <Dashboard />
                </Layout>
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Layout>
                  <ProfilePage />
                </Layout>
              </RequireAuth>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App