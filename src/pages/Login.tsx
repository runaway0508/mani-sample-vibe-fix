import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function Login() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/dashboard', { replace: true })
    })
  }, [navigate])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    await supabase.auth.signInWithOtp({ email })
    navigate('/dashboard')
  }

  return (
    <form onSubmit={submit} className="card">
      <h1>Sign in</h1>
      <p className="muted">Demo only: any email works, nothing is sent.</p>
      <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button>Continue</button>
    </form>
  )
}
