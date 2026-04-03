"use client";

import { useRouter } from "next/navigation";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { DonateSection } from "./DonateSection";

const paypalOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "test",
  currency: "USD",
  intent: "capture" as const,
};

export function DonateClient() {
  const router = useRouter();

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <DonateSection onDonationComplete={() => router.refresh()} />
    </PayPalScriptProvider>
  );
}
