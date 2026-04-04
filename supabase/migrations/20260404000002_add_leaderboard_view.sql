CREATE VIEW leaderboard_view AS
SELECT
  donor_name,
  SUM(amount) AS total_amount,
  COUNT(*) AS donation_count,
  MAX(created_at) AS last_donated_at
FROM donations
GROUP BY donor_name
ORDER BY total_amount DESC
LIMIT 10;
