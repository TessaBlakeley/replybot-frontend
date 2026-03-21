import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function SetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const plan = params.get('plan') || 'manual'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError("Passwords don't match."); return }
    if (password.length < 8)  { setError("Password must be at least 8 characters."); return }

    setLoading(true)
    try {
      await api.post('/auth/register', { email, password })
      await login(email, password)
      navigate('/dashboard?welcome=1')
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'var(--bg)',
    }}>
      <div className="animate-fade-up" style={{ width: '100%', maxWidth: 400 }}>

        {/* Success indicator */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'var(--success-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 style={{ marginBottom: 8 }}>Payment confirmed!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
            Your <strong>{plan === 'pro' ? 'Pro' : 'Manual'}</strong> plan is active.<br />
            Set a password to access your account.
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="label">Email (same as Stripe)</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Min. 8 characters"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="label">Confirm password</label>
              <input className="input" type="password" placeholder="Repeat password"
                value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 'var(--radius-md)',
                background: 'var(--danger-light)', color: 'var(--danger)', fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? <div className="spinner" /> : 'Create account & sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
