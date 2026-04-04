interface EmptyStateProps {
  onCtaClick: () => void;
}

export function EmptyState({ onCtaClick }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <p className="text-4xl mb-4">{"\u{1F451}"}</p>
      <p className="text-2xl font-bold text-primary">
        The Throne is Empty
      </p>
      <p className="text-muted text-base mt-2">
        Be the first to claim the #1 spot
      </p>
      <button
        onClick={onCtaClick}
        className="mt-6 px-6 py-3 min-h-[44px] rounded-md bg-brand text-brand-foreground font-bold hover:bg-brand-hover transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
      >
        Donate Now
      </button>
    </div>
  );
}
