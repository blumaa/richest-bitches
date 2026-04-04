"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { DonateSection } from "./DonateSection";
import { Drawer } from "./Drawer";
import { ShareButton } from "./ShareButton";

const paypalOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "test",
  currency: "USD",
  intent: "capture" as const,
};

export function DonateClient() {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const donateForm = (
    <PayPalScriptProvider options={paypalOptions}>
      <DonateSection onDonationComplete={() => router.refresh()} />
    </PayPalScriptProvider>
  );

  return (
    <>
      {/* Mobile: CTA + Share on same row, then drawer */}
      <div className="lg:hidden">
        <div className="flex gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex-1 py-4 min-h-[44px] rounded-md bg-brand text-brand-foreground font-semibold text-lg hover:bg-brand-hover transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 active:scale-[0.98]"
          >
            {"\u{1F451}"} Claim Your Throne
          </button>
          <ShareButton context="leaderboard" />
        </div>

        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          {donateForm}
        </Drawer>
      </div>

      {/* Desktop: sidebar with donate form + share below */}
      <div className="hidden lg:block space-y-4">
        <div className="border border-border rounded-lg p-6 bg-surface-raised">
          <h2 className="text-xl font-bold text-primary mb-6 text-center">
            Claim Your Throne
          </h2>
          {donateForm}
        </div>
        <ShareButton context="leaderboard" />
      </div>
    </>
  );
}
