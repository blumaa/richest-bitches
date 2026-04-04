import { RankBadge } from "@/components/atoms/RankBadge/RankBadge";
import { Currency } from "@/components/atoms/Currency/Currency";

interface LeaderboardRowProps {
  rank: number;
  donorName: string;
  amount: number;
  donationCount: number;
  isHighlighted?: boolean;
}

export function LeaderboardRow({
  rank,
  donorName,
  amount,
  donationCount,
  isHighlighted,
}: LeaderboardRowProps) {
  return (
    <div
      data-rank={rank}
      className={`flex items-center justify-between rounded-md animate-slideUp ${getRowStyles(rank)} ${isHighlighted ? "ring-2 ring-brand" : ""}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <RankBadge rank={rank} />
        <div className="flex flex-col min-w-0">
          <span className={`font-medium truncate ${getNameStyles(rank)}`}>
            {donorName}
          </span>
          {donationCount > 1 && (
            <span className="text-xs text-muted">
              {donationCount} donations
            </span>
          )}
        </div>
      </div>
      <Currency amount={amount} className={`font-mono font-bold shrink-0 ${getAmountStyles(rank)}`} />
    </div>
  );
}

function getRowStyles(rank: number): string {
  if (rank === 1)
    return "p-4 border border-gold/25 bg-gold/[0.06] shadow-gold";
  if (rank === 2)
    return "p-4 border border-silver/15 bg-silver/[0.04]";
  if (rank === 3)
    return "p-4 border border-bronze/15 bg-bronze/[0.04]";
  return "p-3 border border-border bg-surface-raised";
}

function getNameStyles(rank: number): string {
  if (rank === 1) return "text-base font-semibold text-gold-light";
  if (rank === 2) return "text-base text-secondary";
  if (rank === 3) return "text-base text-bronze";
  return "text-secondary";
}

function getAmountStyles(rank: number): string {
  if (rank === 1) return "text-lg text-gold";
  if (rank <= 3) return "text-base text-secondary";
  return "text-sm text-muted";
}
