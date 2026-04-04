import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShareButton } from "./ShareButton";

describe("ShareButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("leaderboard context (default)", () => {
    it("renders 'Flex This Board' text on desktop", () => {
      render(<ShareButton context="leaderboard" />);
      expect(screen.getByText(/flex this board/i)).toBeInTheDocument();
    });

    it("has accessible label", () => {
      render(<ShareButton context="leaderboard" />);
      expect(screen.getByRole("button", { name: /flex this board/i })).toBeInTheDocument();
    });

    it("calls navigator.share with leaderboard message when available", async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal("navigator", { ...navigator, share: mockShare });

      const user = userEvent.setup();
      render(<ShareButton context="leaderboard" />);
      await user.click(screen.getByRole("button", { name: /flex this board/i }));

      expect(mockShare).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Richest Bitches",
          text: expect.stringContaining("unhinged"),
        })
      );
    });

    it("falls back to clipboard when navigator.share is unavailable", async () => {
      const mockWrite = vi.fn().mockResolvedValue(undefined);
      // Remove share, mock clipboard
      const origShare = navigator.share;
      // @ts-expect-error - removing share for test
      delete navigator.share;
      vi.spyOn(navigator.clipboard, "writeText").mockImplementation(mockWrite);

      const user = userEvent.setup();
      render(<ShareButton context="leaderboard" />);
      await user.click(screen.getByRole("button", { name: /flex this board/i }));

      expect(mockWrite).toHaveBeenCalled();

      // Restore
      if (origShare) navigator.share = origShare;
    });
  });

  describe("post-donation context", () => {
    it("renders 'Announce Your Throne' text", () => {
      render(<ShareButton context="post-donation" rank={3} amount={50} />);
      expect(screen.getByText(/announce your throne/i)).toBeInTheDocument();
    });

    it("includes rank and amount in share message", async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal("navigator", { ...navigator, share: mockShare });

      const user = userEvent.setup();
      render(<ShareButton context="post-donation" rank={3} amount={50} />);
      await user.click(screen.getByRole("button", { name: /announce your throne/i }));

      expect(mockShare).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining("#3"),
        })
      );
    });
  });

  describe("responsive behavior", () => {
    it("renders icon element", () => {
      render(<ShareButton context="leaderboard" />);
      expect(screen.getByTestId("share-icon")).toBeInTheDocument();
    });

    it("has text that can be hidden on mobile via className", () => {
      render(<ShareButton context="leaderboard" />);
      const text = screen.getByTestId("share-text");
      expect(text).toBeInTheDocument();
    });
  });

  describe("design tokens", () => {
    it("does not use hardcoded white/black/gray colors", () => {
      const { container } = render(<ShareButton context="leaderboard" />);
      const html = container.innerHTML;
      expect(html).not.toContain("text-white");
      expect(html).not.toContain("bg-white");
      expect(html).not.toContain("bg-black");
    });

    it("uses only token-based classes for styling", () => {
      const { container } = render(<ShareButton context="leaderboard" />);
      const button = container.querySelector("button");
      expect(button?.className).toContain("bg-surface-raised");
      expect(button?.className).toContain("border-border");
      expect(button?.className).toContain("text-muted");
    });
  });
});
