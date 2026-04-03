"use client";

import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface DonateSectionProps {
  onDonationComplete: () => void;
}

export function DonateSection({ onDonationComplete }: DonateSectionProps) {
  const [donorName, setDonorName] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const isNameValid = donorName.trim().length > 0;

  return (
    <section className="px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Throw Your Money Away
      </h2>

      <div className="max-w-sm mx-auto space-y-4">
        <input
          type="text"
          placeholder="Your name on the leaderboard"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          maxLength={50}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
        />

        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "test",
            currency: "EUR",
            intent: "capture",
          }}
        >
          <PayPalButtons
            disabled={!isNameValid}
            style={{ layout: "vertical", color: "gold", shape: "rect" }}
            createOrder={(_data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: "EUR",
                      value: "10.00",
                    },
                    description: `Donation by ${donorName}`,
                  },
                ],
                intent: "CAPTURE",
              });
            }}
            onApprove={async (_data, actions) => {
              const order = await actions.order?.capture();
              if (!order) return;

              const res = await fetch("/api/donations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  donor_name: donorName,
                  amount: parseFloat(
                    order.purchase_units?.[0]?.amount?.value ?? "0"
                  ),
                  paypal_order_id: order.id,
                }),
              });

              if (res.ok) {
                setStatus("success");
                setDonorName("");
                onDonationComplete();
              } else {
                setStatus("error");
              }
            }}
            onError={() => setStatus("error")}
          />
        </PayPalScriptProvider>

        {status === "success" && (
          <p className="text-green-400 text-center font-semibold">
            Donation recorded! You're on the board!
          </p>
        )}
        {status === "error" && (
          <p className="text-red-400 text-center font-semibold">
            Something went wrong. Try again.
          </p>
        )}
      </div>
    </section>
  );
}
