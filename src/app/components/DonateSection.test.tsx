import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@paypal/react-paypal-js", () => ({
  PayPalScriptProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PayPalButtons: (props: { disabled?: boolean }) => (
    <button data-testid="paypal-button" disabled={props.disabled}>
      PayPal
    </button>
  ),
}));

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

import { DonateSection } from "./DonateSection";

describe("DonateSection", () => {
  it("renders fields in order: name, amount, social", () => {
    const { container } = render(<DonateSection onDonationComplete={vi.fn()} />);
    const inputs = container.querySelectorAll("input");
    expect(inputs[0]).toHaveAttribute("id", "donor-name");
    expect(inputs[1]).toHaveAttribute("id", "donation-amount");
    expect(inputs[2]).toHaveAttribute("id", "social-handle");
  });

  it("renders name input with label", () => {
    render(<DonateSection onDonationComplete={vi.fn()} />);
    expect(screen.getByLabelText(/leaderboard name/i)).toBeInTheDocument();
  });

  it("renders amount input with label", () => {
    render(<DonateSection onDonationComplete={vi.fn()} />);
    expect(screen.getByLabelText(/power level/i)).toBeInTheDocument();
  });

  it("renders social handle input with label", () => {
    render(<DonateSection onDonationComplete={vi.fn()} />);
    expect(screen.getByLabelText(/social/i)).toBeInTheDocument();
  });

  it("does not render preset amount buttons", () => {
    render(<DonateSection onDonationComplete={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "$5" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "$25" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /custom/i })).not.toBeInTheDocument();
  });

  it("PayPal button is disabled when no amount or name", () => {
    render(<DonateSection onDonationComplete={vi.fn()} />);
    expect(screen.getByTestId("paypal-button")).toBeDisabled();
  });

  it("PayPal enabled when name and amount entered", async () => {
    const user = userEvent.setup();
    render(<DonateSection onDonationComplete={vi.fn()} />);
    await user.type(screen.getByLabelText(/leaderboard name/i), "Rich Person");
    await user.type(screen.getByLabelText(/power level/i), "50");
    expect(screen.getByTestId("paypal-button")).not.toBeDisabled();
  });

  it("social handle is optional — PayPal works without it", async () => {
    const user = userEvent.setup();
    render(<DonateSection onDonationComplete={vi.fn()} />);
    await user.type(screen.getByLabelText(/leaderboard name/i), "No Social");
    await user.type(screen.getByLabelText(/power level/i), "10");
    expect(screen.getByTestId("paypal-button")).not.toBeDisabled();
  });

  it("name input has max length of 50", () => {
    render(<DonateSection onDonationComplete={vi.fn()} />);
    expect(screen.getByLabelText(/leaderboard name/i)).toHaveAttribute("maxLength", "50");
  });

  it("has aria-live region for status announcements", () => {
    render(<DonateSection onDonationComplete={vi.fn()} />);
    const statusRegions = screen.getAllByRole("status");
    const ariaLiveRegion = statusRegions.find(
      (el) => el.getAttribute("aria-live") === "polite"
    );
    expect(ariaLiveRegion).toBeTruthy();
  });

  describe("social handle tooltip", () => {
    it("tooltip is hidden by default", () => {
      render(<DonateSection onDonationComplete={vi.fn()} />);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("tooltip shows on click of help icon", async () => {
      const user = userEvent.setup();
      render(<DonateSection onDonationComplete={vi.fn()} />);
      await user.click(screen.getByRole("button", { name: /what is this/i }));
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      expect(screen.getByRole("tooltip")).toHaveTextContent(/linked on the leaderboard/i);
    });

    it("tooltip closes on second click", async () => {
      const user = userEvent.setup();
      render(<DonateSection onDonationComplete={vi.fn()} />);
      const helpButton = screen.getByRole("button", { name: /what is this/i });
      await user.click(helpButton);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      await user.click(helpButton);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });
});
