import { createLocalClient } from './localClient'

const url = import.meta.env.SUPABASE_URL

if (!url) throw new Error('Missing Supabase URL')

export const supabase = createLocalClient(url)
