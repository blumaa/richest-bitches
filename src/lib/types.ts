export interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  paypal_order_id: string;
  social_handle: string | null;
  created_at: string;
}

export interface LeaderboardEntry {
  donor_name: string;
  total_amount: number;
  donation_count: number;
  last_donated_at: string;
  social_handle: string | null;
}
