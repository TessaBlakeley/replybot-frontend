import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login      from './pages/Login'
import SetPassword from './pages/SetPassword'
import Dashboard  from './pages/Dashboard'
import Settings   from './pages/Settings'
import Admin      from './pages/Admin'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user)   return <Navigate to="/login" replace />
  return children
}

function PageLoader() {
  return (
    <div style={{
      height: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
    }}>
      <div className="spinner spinner-dark" style={{ width: 24, height: 24 }} />
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"              element={<Navigate to="/login" replace />} />
      <Route path="/login"         element={<Login />} />
      <Route path="/set-password"  element={<SetPassword />} />
      <Route path="/dashboard"     element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/settings"      element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/admin"         element={<PrivateRoute><Admin /></PrivateRoute>} />
      <Route path="*"              element={<Navigate to="/login" replace />} />    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
