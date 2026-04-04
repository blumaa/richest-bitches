import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { Drawer } from "./Drawer";

// Mock framer-motion to avoid animation complexity in unit tests
vi.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: {
      div: React.forwardRef((props: Record<string, unknown>, ref: React.Ref<HTMLDivElement>) => {
        const { children, drag, dragConstraints, dragElastic, onDragEnd, initial, animate, exit, transition, style, ...rest } = props;
        return React.createElement("div", { ...rest, ref, style }, children);
      }),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

import React from "react";

describe("Drawer", () => {
  it("renders children when open", () => {
    render(
      <Drawer isOpen={true} onClose={vi.fn()}>
        <p>Drawer content</p>
      </Drawer>
    );
    expect(screen.getByText("Drawer content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    const { container } = render(
      <Drawer isOpen={false} onClose={vi.fn()}>
        <p>Drawer content</p>
      </Drawer>
    );
    expect(screen.queryByText("Drawer content")).not.toBeInTheDocument();
  });

  it("closes on Escape key", () => {
    const onClose = vi.fn();
    render(
      <Drawer isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Drawer>
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes on backdrop click", () => {
    const onClose = vi.fn();
    render(
      <Drawer isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Drawer>
    );
    const backdrop = screen.getByTestId("drawer-backdrop");
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("has a drag handle", () => {
    render(
      <Drawer isOpen={true} onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>
    );
    expect(screen.getByTestId("drawer-handle")).toBeInTheDocument();
  });

  it("has aria-modal and dialog role", () => {
    render(
      <Drawer isOpen={true} onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("renders heading", () => {
    render(
      <Drawer isOpen={true} onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>
    );
    expect(screen.getByText("Claim Your Throne")).toBeInTheDocument();
  });
});
