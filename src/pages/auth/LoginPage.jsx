import { useEffect, useState } from 'react'
import { loginUser, registerUser } from '../../lib/api'

export default function LoginPage({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(timer)
  }, [])

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setError('')
    setSuccess('')
    setLoading(false)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    if (!loginEmail || !loginPassword) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await loginUser({
        email: loginEmail,
        password: loginPassword,
      })
      onAuthenticated(result.user)
    } catch (authError) {
      setError(authError.message || 'Unable to login.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    if (!regName || !regPhone || !regEmail || !regPassword || !regConfirm) {
      setError('All fields are required.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await registerUser({
        full_name: regName,
        phone_number: regPhone,
        email: regEmail,
        password: regPassword,
        confirm_password: regConfirm,
      })
      setSuccess('Registration successful. Please login to continue.')
      setRegName('')
      setRegPhone('')
      setRegEmail('')
      setRegPassword('')
      setRegConfirm('')
      setMode('login')
      setLoginEmail(regEmail)
      setLoginPassword('')
    } catch (authError) {
      setError(authError.message || 'Unable to register.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .auth-root { min-height: 100vh; display: grid; grid-template-columns: 1.15fr 0.85fr; background: linear-gradient(135deg, #f6edf4 0%, #ead8e9 48%, #fefafc 100%); font-family: 'DM Sans', sans-serif; }
        .auth-hero { position: relative; overflow: hidden; background: linear-gradient(145deg, #311e27 0%, #5a3850 45%, #8f6593 100%); color: #fff; padding: 64px 72px; display: flex; align-items: center; }
        .auth-hero::before { content:''; position:absolute; inset:0; background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 30%), radial-gradient(circle at 80% 75%, rgba(255,255,255,0.14), transparent 28%); }
        .auth-copy { position: relative; z-index: 1; max-width: 520px; opacity: ${mounted ? 1 : 0}; transform: translateY(${mounted ? '0' : '18px'}); transition: all 0.45s ease; }
        .auth-badge { display:inline-flex; align-items:center; gap:10px; padding:10px 16px; border-radius:999px; background: rgba(255,255,255,0.14); border:1px solid rgba(255,255,255,0.18); font-size:12px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:22px; }
        .auth-title { font-family: 'Sora', sans-serif; font-size: clamp(34px, 4vw, 56px); line-height: 1.06; letter-spacing: -0.03em; margin: 0 0 18px; }
        .auth-title span { color: #f3c6f5; }
        .auth-desc { margin: 0 0 30px; font-size: 15px; line-height: 1.8; color: rgba(255,255,255,0.82); max-width: 420px; }
        .auth-points { display:grid; gap:12px; }
        .auth-point { display:flex; align-items:center; gap:12px; font-size:14px; color: rgba(255,255,255,0.9); }
        .auth-dot { width: 10px; height: 10px; border-radius: 999px; background: #f3c6f5; box-shadow: 0 0 0 6px rgba(243,198,245,0.12); }
        .auth-panel { display:flex; align-items:center; justify-content:center; padding: 32px; }
        .auth-card { width: 100%; max-width: 430px; background: rgba(255,255,255,0.88); border:1px solid rgba(143,101,147,0.18); box-shadow: 0 30px 70px rgba(59,37,44,0.14); border-radius: 28px; padding: 28px; backdrop-filter: blur(14px); }
        .auth-tabs { display:flex; gap:8px; margin-bottom:24px; padding:6px; background:#f4ebf3; border-radius:14px; }
        .auth-tab { flex:1; border:none; border-radius:10px; padding:12px; font-size:13px; font-weight:800; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .18s ease; }
        .auth-tab.active { background:#8f6593; color:#fff; box-shadow: 0 8px 18px rgba(143,101,147,0.24); }
        .auth-tab.inactive { background:transparent; color:#71546f; }
        .auth-heading { margin:0 0 4px; font-size:28px; font-family:'Sora',sans-serif; color:#38252d; }
        .auth-sub { margin:0 0 22px; font-size:14px; color:#7b6579; }
        .auth-form { display:grid; gap:16px; }
        .auth-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .auth-field { display:grid; gap:7px; }
        .auth-label { font-size:11px; font-weight:800; color:#7a5f79; text-transform:uppercase; letter-spacing:0.08em; }
        .auth-input { width:100%; border:1px solid #dbc7dc; background:#fff; border-radius:14px; padding:13px 14px; font-size:14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .18s ease, box-shadow .18s ease; }
        .auth-input:focus { border-color:#8f6593; box-shadow:0 0 0 4px rgba(143,101,147,0.12); }
        .auth-error, .auth-success { border-radius:14px; padding:12px 14px; font-size:13px; font-weight:700; }
        .auth-error { background:#fee2e2; color:#991b1b; }
        .auth-success { background:#dcfce7; color:#166534; }
        .auth-submit { border:none; border-radius:14px; background:linear-gradient(135deg, #8f6593 0%, #6d466d 100%); color:#fff; padding:14px 18px; font-size:14px; font-weight:800; cursor:pointer; box-shadow: 0 14px 30px rgba(143,101,147,0.24); }
        .auth-submit:disabled { opacity: 0.72; cursor: not-allowed; }
        @media (max-width: 960px) {
          .auth-root { grid-template-columns: 1fr; }
          .auth-hero { display:none; }
          .auth-panel { padding: 20px; }
        }
        @media (max-width: 560px) {
          .auth-card { padding: 22px 18px; border-radius: 22px; }
          .auth-grid { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="auth-root">
        <section className="auth-hero">
          <div className="auth-copy">
            <div className="auth-badge">ManufactERP Secure Access</div>
            <h1 className="auth-title">Control your <span>factory workflow</span> from one secure place.</h1>
            <p className="auth-desc">
              Login, register, and manage your manufacturing operations with one connected system across frontend, backend, and database.
            </p>
            <div className="auth-points">
              <div className="auth-point"><span className="auth-dot" />Real PostgreSQL-backed users</div>
              <div className="auth-point"><span className="auth-dot" />FastAPI authentication endpoints</div>
              <div className="auth-point"><span className="auth-dot" />Protected ERP dashboard access</div>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-card">
            <div className="auth-tabs">
              <button type="button" className={`auth-tab ${mode === 'login' ? 'active' : 'inactive'}`} onClick={() => switchMode('login')}>Login</button>
              <button type="button" className={`auth-tab ${mode === 'register' ? 'active' : 'inactive'}`} onClick={() => switchMode('register')}>Register</button>
            </div>

            <h2 className="auth-heading">{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
            <p className="auth-sub">
              {mode === 'login' ? 'Use your account to access the ERP.' : 'Create a real user account stored in PostgreSQL.'}
            </p>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            {mode === 'login' ? (
              <form className="auth-form" onSubmit={handleLogin}>
                <label className="auth-field">
                  <span className="auth-label">Email</span>
                  <input className="auth-input" type="email" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} placeholder="you@company.com" />
                </label>
                <label className="auth-field">
                  <span className="auth-label">Password</span>
                  <input className="auth-input" type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} placeholder="Enter your password" />
                </label>
                <button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleRegister}>
                <div className="auth-grid">
                  <label className="auth-field">
                    <span className="auth-label">Full Name</span>
                    <input className="auth-input" type="text" value={regName} onChange={(event) => setRegName(event.target.value)} placeholder="Balu Kumar" />
                  </label>
                  <label className="auth-field">
                    <span className="auth-label">Phone Number</span>
                    <input className="auth-input" type="tel" value={regPhone} onChange={(event) => setRegPhone(event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="9876543210" />
                  </label>
                </div>
                <label className="auth-field">
                  <span className="auth-label">Email</span>
                  <input className="auth-input" type="email" value={regEmail} onChange={(event) => setRegEmail(event.target.value)} placeholder="you@company.com" />
                </label>
                <div className="auth-grid">
                  <label className="auth-field">
                    <span className="auth-label">Password</span>
                    <input className="auth-input" type="password" value={regPassword} onChange={(event) => setRegPassword(event.target.value)} placeholder="Minimum 6 characters" />
                  </label>
                  <label className="auth-field">
                    <span className="auth-label">Confirm Password</span>
                    <input className="auth-input" type="password" value={regConfirm} onChange={(event) => setRegConfirm(event.target.value)} placeholder="Re-enter password" />
                  </label>
                </div>
                <button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
