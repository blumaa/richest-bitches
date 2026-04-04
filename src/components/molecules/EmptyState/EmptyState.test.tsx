import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders motivating headline", () => {
    render(<EmptyState onCtaClick={vi.fn()} />);
    expect(screen.getByText(/the throne is empty/i)).toBeInTheDocument();
  });

  it("renders CTA button", () => {
    render(<EmptyState onCtaClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: /donate now/i })).toBeInTheDocument();
  });

  it("calls onCtaClick when CTA is clicked", async () => {
    const user = userEvent.setup();
    const onCtaClick = vi.fn();
    render(<EmptyState onCtaClick={onCtaClick} />);
    await user.click(screen.getByRole("button", { name: /donate now/i }));
    expect(onCtaClick).toHaveBeenCalledOnce();
  });
});
