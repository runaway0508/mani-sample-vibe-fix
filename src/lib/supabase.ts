import { createLocalClient } from './localClient'

// Vite only exposes variables prefixed with VITE_ to browser code.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined

if (!url) {
  throw new Error('VITE_SUPABASE_URL is not set. Copy .env.example to .env (locally) or add it in the host build settings.')
}

export const supabase = createLocalClient(url)
