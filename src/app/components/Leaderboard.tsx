import type { LeaderboardEntry } from "@/lib/types";
import { parseSocialHandle } from "@/lib/social";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getRankDisplay(rank: number): string {
  if (rank === 1) return "\u{1F451}";
  if (rank === 2) return "\u{1F948}";
  if (rank === 3) return "\u{1F949}";
  return `${rank}`;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <p className="text-4xl mb-4">{"\u{1F451}"}</p>
        <p className="text-2xl font-bold text-primary">
          The Throne is Empty
        </p>
        <p className="text-muted text-base mt-2">
          Be the first to claim the #1 spot
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Donation leaderboard">
      <h2 className="text-xs font-semibold tracking-widest text-muted uppercase mb-4 px-4">
        Leaderboard
      </h2>
      <div className="space-y-2 px-4">
        {entries.map((entry, index) => {
          const rank = index + 1;
          return (
            <div
              key={entry.donor_name}
              data-rank={rank}
              className={`flex items-center justify-between rounded-md animate-slideUp ${getRankRowStyles(rank)}`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={getRankBadgeStyles(rank)}>
                  {getRankDisplay(rank)}
                </span>
                <div className="flex flex-col min-w-0">
                  {renderDonorName(entry, rank)}
                  {entry.donation_count > 1 && (
                    <span className="text-xs text-muted">
                      {entry.donation_count} donations
                    </span>
                  )}
                </div>
              </div>
              <span className={`font-mono font-bold shrink-0 ${getRankAmountStyles(rank)}`}>
                {formatCurrency(entry.total_amount)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function renderDonorName(entry: LeaderboardEntry, rank: number) {
  const nameClass = `font-medium truncate ${getRankNameStyles(rank)}`;
  const social = entry.social_handle ? parseSocialHandle(entry.social_handle) : null;

  if (social) {
    return (
      <a
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${nameClass} hover:underline`}
      >
        {entry.donor_name}
      </a>
    );
  }

  return <span className={nameClass}>{entry.donor_name}</span>;
}

function getRankRowStyles(rank: number): string {
  if (rank === 1) {
    return "p-4 border border-gold/25 bg-gold/[0.06] shadow-gold";
  }
  if (rank === 2) {
    return "p-4 border border-silver/15 bg-silver/[0.04]";
  }
  if (rank === 3) {
    return "p-4 border border-bronze/15 bg-bronze/[0.04]";
  }
  return `p-3 border border-border bg-surface-raised${rank >= 8 ? " opacity-50" : ""}`;
}

function getRankBadgeStyles(rank: number): string {
  const base = "flex items-center justify-center shrink-0";
  if (rank === 1) return `${base} text-2xl w-9 h-9`;
  if (rank <= 3) return `${base} text-xl w-9 h-9`;
  return `${base} text-base font-medium w-8 text-center text-muted`;
}

function getRankNameStyles(rank: number): string {
  if (rank === 1) return "text-base font-semibold text-gold-light";
  if (rank === 2) return "text-base text-secondary";
  if (rank === 3) return "text-base text-bronze";
  return "text-secondary";
}

function getRankAmountStyles(rank: number): string {
  if (rank === 1) return "text-lg text-gold";
  if (rank <= 3) return "text-base text-secondary";
  return "text-sm text-muted";
}
