import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export function Protected({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <p className="muted">Loading…</p>
  if (!session) return <Navigate to="/login" replace />
  return <>{children}</>
}
