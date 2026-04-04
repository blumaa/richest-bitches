import { Header } from "./components/Header";
import { Leaderboard } from "./components/Leaderboard";
import { DonateClient } from "./components/DonateClient";
import { createClient } from "@/utils/supabase/server";
import type { LeaderboardEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leaderboard_view")
    .select("donor_name, total_amount, donation_count, last_donated_at, social_handle");

  if (error) {
    console.error("Failed to fetch leaderboard:", error.message);
    return [];
  }

  return (data as LeaderboardEntry[]) ?? [];
}

export default async function Home() {
  const leaderboard = await getLeaderboard();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Richest Bitches",
    description: "The ultimate donation leaderboard. Throw away your money for bragging rights.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  };

  return (
    <main id="main-content" className="min-h-screen bg-surface px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-lg lg:max-w-5xl">
        <Header />

        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-3">
            <Leaderboard entries={leaderboard} />
          </div>

          <div className="lg:col-span-2 mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-8">
              <DonateClient />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
