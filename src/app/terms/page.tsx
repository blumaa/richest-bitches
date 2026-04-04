import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Richest Bitches donation leaderboard.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-2xl prose prose">
        <h1 className="text-3xl font-black text-primary">Terms of Service</h1>
        <p className="text-muted mt-4">
          Last updated: April 2026
        </p>
        <h2 className="text-xl font-bold text-primary mt-8">1. Overview</h2>
        <p className="text-secondary">
          Richest Bitches is a novelty donation leaderboard. By making a donation, you
          acknowledge that your payment is voluntary and non-refundable except as
          described in our Refund Policy.
        </p>
        <h2 className="text-xl font-bold text-primary mt-8">2. Donations</h2>
        <p className="text-secondary">
          All donations are processed through PayPal. Your name (as entered) will
          appear on the public leaderboard ranked by total donation amount. We reserve
          the right to remove names that contain offensive, abusive, or inappropriate
          content.
        </p>
        <h2 className="text-xl font-bold text-primary mt-8">3. No Guarantees</h2>
        <p className="text-secondary">
          This service is provided &quot;as is&quot; without warranties of any kind. We
          do not guarantee uptime, data retention, or leaderboard accuracy.
        </p>
        <h2 className="text-xl font-bold text-primary mt-8">4. Changes</h2>
        <p className="text-secondary">
          We may update these terms at any time. Continued use of the service
          constitutes acceptance of updated terms.
        </p>
      </div>
    </main>
  );
}
