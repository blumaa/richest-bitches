import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Currency, formatCurrency } from "./Currency";

describe("Currency", () => {
  it("formats 100 as $100.00", () => {
    render(<Currency amount={100} />);
    expect(screen.getByText("$100.00")).toBeInTheDocument();
  });

  it("formats 1234.5 as $1,234.50", () => {
    render(<Currency amount={1234.5} />);
    expect(screen.getByText("$1,234.50")).toBeInTheDocument();
  });

  it("formats 0 as $0.00", () => {
    render(<Currency amount={0} />);
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("applies className", () => {
    const { container } = render(<Currency amount={50} className="text-xl" />);
    expect(container.querySelector("span")).toHaveClass("text-xl");
  });
});

describe("formatCurrency", () => {
  it("returns formatted string", () => {
    expect(formatCurrency(42.5)).toBe("$42.50");
  });
});
