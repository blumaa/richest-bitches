"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { ShareButton } from "./ShareButton";

type Status = "idle" | "processing" | "success" | "error";

interface DonateSectionProps {
  onDonationComplete: () => void;
}

export function DonateSection({ onDonationComplete }: DonateSectionProps) {
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [socialHandle, setSocialHandle] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [rank, setRank] = useState<number | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const tooltipId = "social-tooltip";

  const isNameValid = donorName.trim().length > 0;
  const parsedAmount = parseFloat(amount);
  const isAmountValid = !isNaN(parsedAmount) && parsedAmount > 0;
  const isProcessing = status === "processing";

  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, []);

  // Close tooltip on Escape
  useEffect(() => {
    if (!showTooltip) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowTooltip(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showTooltip]);

  const setStatusWithAutoClear = useCallback((newStatus: "success" | "error") => {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    setStatus(newStatus);
    dismissTimerRef.current = setTimeout(() => {
      setStatus("idle");
      setRank(null);
    }, 5000);
    statusRef.current?.focus();
  }, []);

  function dismissStatus() {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    setStatus("idle");
    setRank(null);
  }

  function fireConfetti() {
    import("canvas-confetti").then((mod) => {
      const confetti = mod.default;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#0007cd", "#FFED80", "#00ffff"],
      });
    });
  }

  return (
    <section aria-label="Make a donation">
      {/* 1. Name */}
      <div className="mb-4">
        <label htmlFor="donor-name" className="block text-xs text-secondary font-medium mb-1.5">
          Leaderboard name
        </label>
        <input
          id="donor-name"
          type="text"
          placeholder="Your name"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          maxLength={50}
          disabled={isProcessing}
          className="w-full px-4 py-3 rounded-md bg-surface-raised border border-border text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent disabled:opacity-50"
        />
      </div>

      {/* 2. Amount */}
      <div className="mb-4">
        <label htmlFor="donation-amount" className="block text-xs text-secondary font-medium mb-1.5">
          Power level
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-medium" aria-hidden="true">$</span>
          <input
            id="donation-amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="0.01"
            disabled={isProcessing}
            className="w-full pl-8 pr-4 py-3 rounded-md bg-surface-raised border border-border text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent disabled:opacity-50"
          />
        </div>
      </div>

      {/* 3. Social handle — optional */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-1.5">
          <label htmlFor="social-handle" className="text-xs text-secondary font-medium">
            Social (optional)
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTooltip(!showTooltip)}
              className="min-w-[44px] min-h-[44px] -m-3 inline-flex items-center justify-center text-muted hover:text-secondary transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              aria-label="What is this?"
              aria-describedby={showTooltip ? tooltipId : undefined}
            >
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-border text-[10px]" aria-hidden="true">?</span>
            </button>
            {showTooltip && (
              <div
                id={tooltipId}
                role="tooltip"
                className="absolute left-6 -top-1 w-48 p-2 rounded-lg bg-surface-overlay border border-border text-xs text-secondary z-10"
              >
                Your @ or profile URL will be linked on the leaderboard
              </div>
            )}
          </div>
        </div>
        <input
          id="social-handle"
          type="text"
          placeholder="@ or profile URL"
          value={socialHandle}
          onChange={(e) => setSocialHandle(e.target.value)}
          maxLength={200}
          disabled={isProcessing}
          className="w-full px-4 py-3 rounded-md bg-surface-raised border border-border text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent disabled:opacity-50"
        />
      </div>

      {/* Status messages — single live region */}
      <div ref={statusRef} role="status" aria-live="polite" tabIndex={-1}>
        {isProcessing && (
          <p className="text-brand text-center font-medium animate-pulse mb-3">
            Processing your donation...
          </p>
        )}
        {status === "success" && (
          <div className="border border-gold/20 bg-gold/[0.06] rounded-md p-5 text-center animate-slideUp mb-3">
            {rank && (
              <p className="text-3xl font-bold text-gold mb-1">
                You&apos;re #{rank}!
              </p>
            )}
            <p className="text-secondary font-medium">
              You&apos;re on the board!
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <ShareButton
                context="post-donation"
                rank={rank ?? undefined}
              />
              <button
                onClick={dismissStatus}
                className="px-4 py-2 min-h-[44px] rounded-md bg-surface-raised border border-border text-secondary text-sm hover:text-primary transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center justify-center gap-2 mb-3">
            <p className="text-error text-center font-medium">
              Something went wrong. Try again.
            </p>
            <button
              onClick={dismissStatus}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-muted hover:text-primary text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              aria-label="Dismiss error message"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* PayPal */}
      <p className="text-xs text-secondary mb-2 text-center">Secure checkout</p>
      <PayPalButtons
        disabled={!isNameValid || !isAmountValid || isProcessing}
        style={{ layout: "vertical", color: "gold", shape: "rect" }}
        createOrder={(_data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: parsedAmount.toFixed(2),
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

          setStatus("processing");

          const res = await fetch("/api/donations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              donor_name: donorName,
              amount: parseFloat(
                order.purchase_units?.[0]?.amount?.value ?? "0"
              ),
              paypal_order_id: order.id,
              social_handle: socialHandle || undefined,
            }),
          });

          if (res.ok) {
            const json = await res.json();
            setRank(json.rank);
            setStatusWithAutoClear("success");
            fireConfetti();
            setDonorName("");
            setSocialHandle("");
            setAmount("");
            onDonationComplete();
          } else {
            setStatusWithAutoClear("error");
          }
        }}
        onError={() => setStatusWithAutoClear("error")}
      />

      {/* Footer */}
      <p className="text-xs text-muted text-center mt-4">
        By donating, you agree to our{" "}
        <a href="/terms" className="underline hover:text-secondary cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2">
          Terms
        </a>{" "}
        &{" "}
        <a href="/refunds" className="underline hover:text-secondary cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2">
          Refund Policy
        </a>
      </p>
    </section>
  );
}
