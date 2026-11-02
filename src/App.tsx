import { Link, Route, Routes } from 'react-router-dom'
import { Protected } from './components/Protected'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'

function Home() {
  return (
    <div className="card">
      <h1>Notes</h1>
      <p>A small Vite + React + Supabase-style app, broken on purpose and then fixed.</p>
      <p><Link to="/dashboard">Open my notes →</Link></p>
    </div>
  )
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
    </Routes>
  )
}
