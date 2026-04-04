import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusMessage } from "./StatusMessage";

describe("StatusMessage", () => {
  it("renders message text", () => {
    render(<StatusMessage type="success" message="Done!" />);
    expect(screen.getByText("Done!")).toBeInTheDocument();
  });

  it("shows dismiss button when onDismiss is provided", () => {
    render(<StatusMessage type="error" message="Oops" onDismiss={vi.fn()} />);
    expect(screen.getByRole("button", { name: /dismiss/i })).toBeInTheDocument();
  });

  it("calls onDismiss when dismiss button is clicked", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<StatusMessage type="error" message="Oops" onDismiss={onDismiss} />);
    await user.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("does not show dismiss button when onDismiss is omitted", () => {
    render(<StatusMessage type="success" message="Done!" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("has role=alert for error variant", () => {
    render(<StatusMessage type="error" message="Error" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("has role=status for success variant", () => {
    render(<StatusMessage type="success" message="Success" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has aria-live=polite", () => {
    render(<StatusMessage type="loading" message="Loading..." />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });
});
