import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RankBadge } from "./RankBadge";

describe("RankBadge", () => {
  it("renders crown emoji for rank 1", () => {
    render(<RankBadge rank={1} />);
    expect(screen.getByRole("img", { name: "Rank 1" })).toHaveTextContent("\u{1F451}");
  });

  it("renders silver medal for rank 2", () => {
    render(<RankBadge rank={2} />);
    expect(screen.getByRole("img", { name: "Rank 2" })).toHaveTextContent("\u{1F948}");
  });

  it("renders bronze medal for rank 3", () => {
    render(<RankBadge rank={3} />);
    expect(screen.getByRole("img", { name: "Rank 3" })).toHaveTextContent("\u{1F949}");
  });

  it("renders numeric string for rank 4+", () => {
    render(<RankBadge rank={7} />);
    expect(screen.getByRole("img", { name: "Rank 7" })).toHaveTextContent("7");
  });
});
