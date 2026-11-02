// Mirrors supabase/migrations/*.sql so the demo runs without a Supabase project.
// RLS is on: a command with no matching policy silently matches zero rows, like Postgres.
export type Row = Record<string, unknown>
type Check = (row: Row, uid: string | null) => boolean

export const policies: Record<string, { select?: Check; insert?: Check }> = {
  notes: {
    insert: (row, uid) => uid !== null && row.user_id === uid,
  },
}
