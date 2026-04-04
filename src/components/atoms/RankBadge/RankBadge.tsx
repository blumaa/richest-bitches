function getRankDisplay(rank: number): string {
  if (rank === 1) return "\u{1F451}";
  if (rank === 2) return "\u{1F948}";
  if (rank === 3) return "\u{1F949}";
  return `${rank}`;
}

function getRankBadgeStyles(rank: number): string {
  const base = "flex items-center justify-center shrink-0";
  if (rank === 1) return `${base} text-2xl w-9 h-9`;
  if (rank <= 3) return `${base} text-xl w-9 h-9`;
  return `${base} text-base font-medium w-8 text-center text-muted`;
}

interface RankBadgeProps {
  rank: number;
}

export function RankBadge({ rank }: RankBadgeProps) {
  return (
    <span className={getRankBadgeStyles(rank)} aria-label={`Rank ${rank}`} role="img">
      {getRankDisplay(rank)}
    </span>
  );
}
