import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund policy for Richest Bitches donation leaderboard.",
};

export default function RefundsPage() {
  return (
    <main className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-2xl prose prose">
        <h1 className="text-3xl font-black text-primary">Refund Policy</h1>
        <p className="text-muted mt-4">
          Last updated: April 2026
        </p>
        <h2 className="text-xl font-bold text-primary mt-8">Refunds</h2>
        <p className="text-secondary">
          All donations on Richest Bitches are voluntary and generally
          non-refundable. The purpose of the platform is entertainment &mdash; your
          donation buys you a spot on the leaderboard.
        </p>
        <h2 className="text-xl font-bold text-primary mt-8">Exceptions</h2>
        <p className="text-secondary">
          Refunds may be issued at our discretion in cases of:
        </p>
        <ul className="text-secondary list-disc pl-6 space-y-2">
          <li>Duplicate charges due to technical errors</li>
          <li>Unauthorized transactions (please also contact PayPal directly)</li>
          <li>Amounts charged differently than what was displayed</li>
        </ul>
        <h2 className="text-xl font-bold text-primary mt-8">How to Request</h2>
        <p className="text-secondary">
          Contact us with your PayPal transaction ID and the reason for your
          request. Refund requests must be made within 30 days of the transaction.
        </p>
      </div>
    </main>
  );
}
