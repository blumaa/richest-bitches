ALTER TABLE donations ADD COLUMN social_handle text;

-- Recreate the view to include social handles
DROP VIEW IF EXISTS leaderboard_view;

CREATE VIEW leaderboard_view AS
SELECT
  donor_name,
  SUM(amount) AS total_amount,
  COUNT(*) AS donation_count,
  MAX(created_at) AS last_donated_at,
  -- Use the most recent non-null social handle for this donor
  (
    SELECT d2.social_handle
    FROM donations d2
    WHERE d2.donor_name = donations.donor_name
      AND d2.social_handle IS NOT NULL
    ORDER BY d2.created_at DESC
    LIMIT 1
  ) AS social_handle
FROM donations
GROUP BY donor_name
ORDER BY total_amount DESC
LIMIT 10;
