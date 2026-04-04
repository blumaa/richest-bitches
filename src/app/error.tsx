"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Something went wrong
        </h2>
        <p className="text-secondary mb-6">
          We couldn&apos;t load the leaderboard. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg bg-brand text-brand-foreground font-bold hover:bg-brand-hover transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
