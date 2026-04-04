import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";

const MOTION_SKIP_PROPS = ["drag", "dragConstraints", "dragElastic", "onDragEnd", "initial", "animate", "exit", "transition"];

vi.mock("framer-motion", async () => {
  const React = await import("react");
  return {
    motion: {
      div: React.forwardRef(function MotionDiv(
        props: Record<string, unknown>,
        ref: React.Ref<HTMLDivElement>
      ) {
        const { children, style, ...rest } = props;
        const htmlProps: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(rest)) {
          if (!MOTION_SKIP_PROPS.includes(key)) {
            htmlProps[key] = value;
          }
        }
        return React.createElement("div", { ...htmlProps, ref, style }, children as React.ReactNode);
      }),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

import { Drawer } from "./Drawer";

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
    render(
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
