import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Leaderboard } from "./Leaderboard";
import type { LeaderboardEntry } from "@/lib/types";

const makeEntries = (count: number): LeaderboardEntry[] =>
  Array.from({ length: count }, (_, i) => ({
    donor_name: `Donor ${i + 1}`,
    total_amount: (count - i) * 100,
    donation_count: count - i,
    last_donated_at: new Date().toISOString(),
    social_handle: null,
  }));

describe("Leaderboard", () => {
  it("renders empty state when data is empty", () => {
    render(<Leaderboard entries={[]} />);
    expect(screen.getByText(/the throne is empty/i)).toBeInTheDocument();
  });

  it("renders up to 10 rows with rank, name, and formatted amount", () => {
    const entries = makeEntries(10);
    render(<Leaderboard entries={entries} />);
    expect(screen.getByText("Donor 1")).toBeInTheDocument();
    expect(screen.getByText("Donor 10")).toBeInTheDocument();
    expect(screen.getByText("$1,000.00")).toBeInTheDocument();
  });

  it("has gold/silver/bronze styling for top 3", () => {
    const entries = makeEntries(5);
    const { container } = render(<Leaderboard entries={entries} />);
    const rows = container.querySelectorAll("[data-rank]");
    expect(rows[0]).toHaveAttribute("data-rank", "1");
    expect(rows[1]).toHaveAttribute("data-rank", "2");
    expect(rows[2]).toHaveAttribute("data-rank", "3");
  });

  it("formats amounts as currency", () => {
    const entries = makeEntries(1);
    render(<Leaderboard entries={entries} />);
    expect(screen.getByText("$100.00")).toBeInTheDocument();
  });

  it("displays aggregated total, not individual amounts", () => {
    const entries: LeaderboardEntry[] = [
      {
        donor_name: "Big Spender",
        total_amount: 500,
        donation_count: 5,
        last_donated_at: new Date().toISOString(),
        social_handle: null,
      },
    ];
    render(<Leaderboard entries={entries} />);
    expect(screen.getByText("$500.00")).toBeInTheDocument();
    expect(screen.getByText("Big Spender")).toBeInTheDocument();
  });

  it("shows donation count when donor has multiple donations", () => {
    const entries: LeaderboardEntry[] = [
      {
        donor_name: "Repeat Donor",
        total_amount: 300,
        donation_count: 3,
        last_donated_at: new Date().toISOString(),
        social_handle: null,
      },
    ];
    render(<Leaderboard entries={entries} />);
    expect(screen.getByText("3 donations")).toBeInTheDocument();
  });

  it("does not show donation count for single donations", () => {
    const entries: LeaderboardEntry[] = [
      {
        donor_name: "One Timer",
        total_amount: 100,
        donation_count: 1,
        last_donated_at: new Date().toISOString(),
        social_handle: null,
      },
    ];
    render(<Leaderboard entries={entries} />);
    expect(screen.queryByText(/donations/i)).not.toBeInTheDocument();
  });

  it("renders name as a link when social_handle is provided", () => {
    const entries: LeaderboardEntry[] = [
      {
        donor_name: "Social User",
        total_amount: 200,
        donation_count: 1,
        last_donated_at: new Date().toISOString(),
        social_handle: "@richguy",
      },
    ];
    render(<Leaderboard entries={entries} />);
    const link = screen.getByRole("link", { name: /social user/i });
    expect(link).toHaveAttribute("href", "https://x.com/richguy");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders name as plain text when social_handle is null", () => {
    const entries: LeaderboardEntry[] = [
      {
        donor_name: "No Social",
        total_amount: 100,
        donation_count: 1,
        last_donated_at: new Date().toISOString(),
        social_handle: null,
      },
    ];
    render(<Leaderboard entries={entries} />);
    expect(screen.getByText("No Social")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
