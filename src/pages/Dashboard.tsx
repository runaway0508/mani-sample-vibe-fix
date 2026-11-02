import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

type Note = { id: string; user_id: string; body: string; created_at: string }

export function Dashboard() {
  const { session } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const { data } = await supabase.from('notes').select()
    setNotes((data ?? []) as Note[])
  }

  useEffect(() => {
    load()
  }, [])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from('notes').insert({ user_id: session!.user.id, body })
    setError(error?.message ?? '')
    setBody('')
    load()
  }

  return (
    <div className="card">
      <h1>My notes</h1>
      <p className="muted">Signed in as {session?.user.email}</p>
      <form onSubmit={add} className="row">
        <input required placeholder="Write a note" value={body} onChange={(e) => setBody(e.target.value)} />
        <button>Add</button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul>
        {notes.map((n) => (
          <li key={n.id}>
            {n.body} <span className="muted">{new Date(n.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
      {notes.length === 0 && <p className="muted">No notes yet.</p>}
      <button className="link" onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  )
}
