import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

export function Login() {
  const [email, setEmail] = useState('')
  const { session, loading } = useAuth()
  const navigate = useNavigate()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    await supabase.auth.signInWithOtp({ email })
    navigate('/dashboard')
  }

  if (loading) return <p className="muted">Loading…</p>
  if (session) return <Navigate to="/dashboard" replace />

  return (
    <form onSubmit={submit} className="card">
      <h1>Sign in</h1>
      <p className="muted">Demo only: any email works, nothing is sent.</p>
      <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button>Continue</button>
    </form>
  )
}
