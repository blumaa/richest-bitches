import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock PayPal to avoid loading the SDK
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

import { DonateSection } from "./DonateSection";

describe("DonateSection", () => {
  it("renders name input and PayPal button", () => {
    render(<DonateSection onDonationComplete={vi.fn()} />);
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(screen.getByTestId("paypal-button")).toBeInTheDocument();
  });

  it("PayPal button is disabled when name input is empty", () => {
    render(<DonateSection onDonationComplete={vi.fn()} />);
    expect(screen.getByTestId("paypal-button")).toBeDisabled();
  });

  it("PayPal button is enabled when name is entered", async () => {
    const user = userEvent.setup();
    render(<DonateSection onDonationComplete={vi.fn()} />);
    await user.type(screen.getByPlaceholderText(/your name/i), "Rich Person");
    expect(screen.getByTestId("paypal-button")).not.toBeDisabled();
  });

  it("name input has max length of 50", () => {
    render(<DonateSection onDonationComplete={vi.fn()} />);
    const input = screen.getByPlaceholderText(/your name/i);
    expect(input).toHaveAttribute("maxLength", "50");
  });
});
