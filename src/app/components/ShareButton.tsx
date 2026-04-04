"use client";

type ShareContext = "leaderboard" | "post-donation";

interface ShareButtonProps {
  context: ShareContext;
  rank?: number;
  amount?: number;
}

const shareConfig = {
  leaderboard: {
    label: "Flex This Board",
    getMessage: () =>
      "Someone is burning money to sit on top of the Richest Bitches leaderboard. These people are unhinged.",
  },
  "post-donation": {
    label: "Announce Your Throne",
    getMessage: (rank?: number, amount?: number) => {
      const parts = ["I just threw away"];
      if (amount) parts.push(`$${amount}`);
      parts.push("for bragging rights on Richest Bitches");
      if (rank) parts.push(`and I'm ranked #${rank}`);
      parts.push("Dethrone me if you can.");
      return parts.join(" ");
    },
  },
} as const;

function ShareIcon() {
  return (
    <svg
      data-testid="share-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

export function ShareButton({ context, rank, amount }: ShareButtonProps) {
  const config = shareConfig[context];

  function handleShare() {
    const text = config.getMessage(rank, amount);
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      navigator.share({ title: "Richest Bitches", text, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text} ${url}`).catch(() => {});
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center justify-center gap-2 px-3 lg:px-4 py-3 min-w-[44px] min-h-[44px] rounded-md bg-surface-raised border border-border text-muted hover:text-primary transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
      aria-label={config.label}
      title={config.label}
    >
      <ShareIcon />
      <span data-testid="share-text" className="hidden lg:inline text-sm font-medium">
        {config.label}
      </span>
    </button>
  );
}
