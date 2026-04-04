import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { themes } from "@/lib/themes";

describe("ThemeSwitcher", () => {
  it("renders with first theme name", () => {
    render(<ThemeSwitcher />);
    expect(screen.getByRole("button")).toHaveTextContent(`Theme: ${themes[0].name}`);
  });

  it("cycles to next theme on click", async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent(`Theme: ${themes[1].name}`);
  });

  it("wraps around to first theme after last", async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher />);
    for (let i = 0; i < themes.length; i++) {
      await user.click(screen.getByRole("button"));
    }
    expect(screen.getByRole("button")).toHaveTextContent(`Theme: ${themes[0].name}`);
  });

  it("sets data-theme attribute on document root when clicked", async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher />);
    await user.click(screen.getByRole("button"));
    expect(document.documentElement.getAttribute("data-theme")).toBe(
      themes[1].name.toLowerCase()
    );
  });

  it("each theme name maps to a lowercase data-theme value", () => {
    for (const theme of themes) {
      expect(theme.name.toLowerCase()).toMatch(/^[a-z]+$/);
    }
  });
});
