// A tiny stand-in for @supabase/supabase-js (auth + one table) backed by localStorage.
import { policies, type Row } from './policies'

export type User = { id: string; email: string }
export type Session = { user: User }
type Listener = (session: Session | null) => void

const SESSION_KEY = 'vibefix.session'
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

function userId(email: string) {
  let h = 0
  for (const c of email.toLowerCase()) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return `user-${h.toString(16)}`
}

export function createLocalClient(url: string) {
  const listeners = new Set<Listener>()
  const read = (): Session | null => JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null')
  const emit = (s: Session | null) => listeners.forEach((l) => l(s))
  const tableKey = (t: string) => `vibefix.${url}.${t}`
  const rows = (t: string): Row[] => JSON.parse(localStorage.getItem(tableKey(t)) ?? '[]')

  return {
    auth: {
      async getSession() {
        await delay(300) // network round trip
        return { data: { session: read() } }
      },
      async signInWithOtp({ email }: { email: string }) {
        await delay(300)
        const session = { user: { id: userId(email), email } }
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
        emit(session)
        return { error: null }
      },
      async signOut() {
        localStorage.removeItem(SESSION_KEY)
        emit(null)
      },
      onAuthStateChange(cb: (event: string, session: Session | null) => void) {
        const l: Listener = (s) => cb(s ? 'SIGNED_IN' : 'SIGNED_OUT', s)
        listeners.add(l)
        return { data: { subscription: { unsubscribe: () => listeners.delete(l) } } }
      },
    },
    from(table: string) {
      const uid = read()?.user.id ?? null
      const p = policies[table] ?? {}
      return {
        async select() {
          await delay(200)
          return { data: rows(table).filter((r) => p.select?.(r, uid) ?? false), error: null }
        },
        async insert(row: Row) {
          await delay(200)
          if (!p.insert?.(row, uid)) {
            return { data: null, error: { message: 'new row violates row-level security policy' } }
          }
          const full = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...row }
          localStorage.setItem(tableKey(table), JSON.stringify([...rows(table), full]))
          return { data: [full], error: null }
        },
      }
    },
  }
}
