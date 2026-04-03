import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Leaderboard } from "./Leaderboard";
import type { Donation } from "@/lib/types";

const makeDonations = (count: number): Donation[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `uuid-${i}`,
    donor_name: `Donor ${i + 1}`,
    amount: (count - i) * 100,
    paypal_order_id: `ORDER-${i}`,
    created_at: new Date().toISOString(),
  }));

describe("Leaderboard", () => {
  it('renders "No donations yet" when data is empty', () => {
    render(<Leaderboard donations={[]} />);
    expect(screen.getByText(/no donations yet/i)).toBeInTheDocument();
  });

  it("renders up to 10 rows with rank, name, and formatted amount", () => {
    const donations = makeDonations(10);
    render(<Leaderboard donations={donations} />);
    expect(screen.getByText("Donor 1")).toBeInTheDocument();
    expect(screen.getByText("Donor 10")).toBeInTheDocument();
    expect(screen.getByText("$1,000.00")).toBeInTheDocument();
  });

  it("has gold/silver/bronze styling for top 3", () => {
    const donations = makeDonations(5);
    const { container } = render(<Leaderboard donations={donations} />);
    const rows = container.querySelectorAll("[data-rank]");
    expect(rows[0]).toHaveAttribute("data-rank", "1");
    expect(rows[1]).toHaveAttribute("data-rank", "2");
    expect(rows[2]).toHaveAttribute("data-rank", "3");
  });

  it("formats amounts as currency", () => {
    const donations = makeDonations(1);
    render(<Leaderboard donations={donations} />);
    expect(screen.getByText("$100.00")).toBeInTheDocument();
  });
});
