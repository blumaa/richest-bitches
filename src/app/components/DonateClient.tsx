"use client";

import { useRouter } from "next/navigation";
import { DonateSection } from "./DonateSection";

export function DonateClient() {
  const router = useRouter();

  return <DonateSection onDonationComplete={() => router.refresh()} />;
}
