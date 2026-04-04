"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { DonateSection } from "./DonateSection";
import { Drawer } from "./Drawer";

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
      {/* Mobile: CTA button + drawer */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full py-4 rounded-md bg-brand text-brand-foreground font-semibold text-lg hover:bg-brand-hover transition-colors active:scale-[0.98]"
        >
          {"\u{1F451}"} Claim Your Throne
        </button>

        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          {donateForm}
        </Drawer>
      </div>

      {/* Desktop: always-visible sidebar */}
      <div className="hidden lg:block">
        <div className="border border-border rounded-lg p-6 bg-surface-raised">
          <h2 className="text-xl font-bold text-primary mb-6 text-center">
            Claim Your Throne
          </h2>
          {donateForm}
        </div>
      </div>
    </>
  );
}
