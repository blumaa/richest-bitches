import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LeaderboardRow } from "./LeaderboardRow";

describe("LeaderboardRow", () => {
  it("renders rank badge with correct rank", () => {
    render(<LeaderboardRow rank={1} donorName="Test" amount={100} donationCount={1} />);
    expect(screen.getByRole("img", { name: "Rank 1" })).toBeInTheDocument();
  });

  it("renders donor name", () => {
    render(<LeaderboardRow rank={1} donorName="Big Spender" amount={500} donationCount={1} />);
    expect(screen.getByText("Big Spender")).toBeInTheDocument();
  });

  it("renders formatted currency amount", () => {
    render(<LeaderboardRow rank={1} donorName="Test" amount={1234.5} donationCount={1} />);
    expect(screen.getByText("$1,234.50")).toBeInTheDocument();
  });

  it("shows donation count for multiple donations", () => {
    render(<LeaderboardRow rank={1} donorName="Test" amount={300} donationCount={3} />);
    expect(screen.getByText("3 donations")).toBeInTheDocument();
  });

  it("does not show donation count for single donation", () => {
    render(<LeaderboardRow rank={1} donorName="Test" amount={100} donationCount={1} />);
    expect(screen.queryByText(/donations/i)).not.toBeInTheDocument();
  });

  it("applies highlight styling when isHighlighted", () => {
    const { container } = render(
      <LeaderboardRow rank={1} donorName="Test" amount={100} donationCount={1} isHighlighted />
    );
    expect(container.firstChild).toHaveClass("ring-2");
  });

  it("sets data-rank attribute", () => {
    const { container } = render(
      <LeaderboardRow rank={5} donorName="Test" amount={100} donationCount={1} />
    );
    expect(container.firstChild).toHaveAttribute("data-rank", "5");
  });
});
