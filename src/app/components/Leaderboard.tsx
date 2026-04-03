import type { Donation } from "@/lib/types";

const rankStyles: Record<number, string> = {
  1: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
  2: "text-gray-300 border-gray-300/30 bg-gray-300/5",
  3: "text-amber-600 border-amber-600/30 bg-amber-600/5",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

interface LeaderboardProps {
  donations: Donation[];
}

export function Leaderboard({ donations }: LeaderboardProps) {
  if (donations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No donations yet</p>
        <p className="text-sm mt-1">Be the first to throw away some money!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-4">
      {donations.map((donation, index) => {
        const rank = index + 1;
        const style = rankStyles[rank] ?? "text-gray-400 border-gray-700 bg-gray-800/50";

        return (
          <div
            key={donation.id}
            data-rank={rank}
            className={`flex items-center justify-between p-3 rounded-lg border ${style}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold w-8 text-center">
                {rank}
              </span>
              <span className="font-semibold truncate max-w-[160px]">
                {donation.donor_name}
              </span>
            </div>
            <span className="font-mono font-bold text-lg">
              {formatCurrency(donation.amount)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
