-- RLS was enabled with an insert policy only, so every select returned [] (no error).
create policy "notes_select_own" on public.notes
  for select to authenticated
  using (auth.uid() = user_id);
