-- Enable Row Level Security on the donations table.
-- The anon key (used in SSR and browser clients) is locked to SELECT-only.
-- The service_role key (used in the API route) bypasses RLS entirely.

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read donations (leaderboard)
CREATE POLICY "Anyone can read donations"
  ON donations FOR SELECT
  USING (true);

-- No INSERT/UPDATE/DELETE policies for anon role = denied by default.
-- The API route uses the service_role key which bypasses RLS.
