import { Header } from "./components/Header";
import { Leaderboard } from "./components/Leaderboard";
import { DonateClient } from "./components/DonateClient";
import { createClient } from "@/utils/supabase/server";
import type { Donation } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getLeaderboard(): Promise<Donation[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("donations")
    .select("id, donor_name, amount, paypal_order_id, created_at")
    .order("amount", { ascending: false })
    .limit(10);

  return (data as Donation[]) ?? [];
}

export default async function Home() {
  const donations = await getLeaderboard();

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-md mx-auto">
        <Header />
        <Leaderboard donations={donations} />
        <DonateClient />
      </div>
    </div>
  );
}
