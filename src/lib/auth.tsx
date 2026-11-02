import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from './supabase'
import type { Session } from './localClient'

const AuthContext = createContext<{ session: Session | null }>({ session: null })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const location = useLocation()

  // refresh the session on every page change
  useEffect(() => {
    setSession(null)
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [location.pathname])

  return <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
