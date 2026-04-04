import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { tokens } from "./tokens";
import { themes } from "./themes";

const globalsCss = readFileSync(
  resolve(__dirname, "../app/globals.css"),
  "utf-8"
);

describe("Design tokens", () => {
  describe("tokens source of truth", () => {
    it("has all required semantic color roles", () => {
      const required = [
        "brand", "brand-hover", "brand-active", "brand-foreground",
        "surface", "surface-raised", "surface-overlay",
        "border", "primary", "secondary", "muted",
        "error", "success",
      ];
      for (const role of required) {
        expect(tokens.colors).toHaveProperty(role);
      }
    });

    it("has all rank colors", () => {
      expect(tokens.colors).toHaveProperty("gold");
      expect(tokens.colors).toHaveProperty("gold-light");
      expect(tokens.colors).toHaveProperty("silver");
      expect(tokens.colors).toHaveProperty("bronze");
    });

    it("all color values are valid hex", () => {
      for (const [name, value] of Object.entries(tokens.colors)) {
        expect(value, `${name} should be hex`).toMatch(/^#[0-9a-fA-F]{3,8}$/);
      }
    });
  });

  describe("globals.css @theme inline mappings", () => {
    it("maps every color token to var(--app-*)", () => {
      const themeSection = globalsCss.split("@theme inline")[1]?.split("}")[0] ?? "";
      for (const name of Object.keys(tokens.colors)) {
        expect(
          themeSection,
          `@theme inline missing --color-${name}: var(--app-${name})`
        ).toContain(`--color-${name}: var(--app-${name})`);
      }
    });

    it("maps radius tokens to var(--app-*)", () => {
      const themeSection = globalsCss.split("@theme inline")[1]?.split("}")[0] ?? "";
      for (const name of Object.keys(tokens.radius)) {
        expect(
          themeSection,
          `@theme inline missing --radius-${name}`
        ).toContain(`--radius-${name}: var(--app-radius-${name})`);
      }
    });

    it("uses @theme inline (not @theme without inline)", () => {
      expect(globalsCss).toContain("@theme inline");
    });

    it("does not import external CSS files beyond tailwindcss", () => {
      const imports = globalsCss.match(/@import\s+["'][^"']+["']/g) ?? [];
      for (const imp of imports) {
        expect(imp).toContain("tailwindcss");
      }
    });
  });

  describe("themes.ts completeness", () => {
    it("every theme has all required color tokens", () => {
      const requiredColors = Object.keys(tokens.colors);
      for (const theme of themes) {
        for (const color of requiredColors) {
          expect(
            theme.colors,
            `Theme "${theme.name}" missing color: ${color}`
          ).toHaveProperty(color);
        }
      }
    });

    it("every theme has all required typography tokens", () => {
      const requiredTypo = ["heading-weight", "heading-tracking", "heading-leading", "body-leading"];
      for (const theme of themes) {
        for (const key of requiredTypo) {
          expect(
            theme.typography,
            `Theme "${theme.name}" missing typography: ${key}`
          ).toHaveProperty(key);
        }
      }
    });

    it("every theme has all required radius tokens", () => {
      const requiredRadius = ["sm", "md", "lg"];
      for (const theme of themes) {
        for (const key of requiredRadius) {
          expect(
            theme.radius,
            `Theme "${theme.name}" missing radius: ${key}`
          ).toHaveProperty(key);
        }
      }
    });

    it("every theme has font definitions", () => {
      for (const theme of themes) {
        expect(theme.fonts.heading, `Theme "${theme.name}" missing fonts.heading`).toBeTruthy();
        expect(theme.fonts.body, `Theme "${theme.name}" missing fonts.body`).toBeTruthy();
        expect(theme.fonts.mono, `Theme "${theme.name}" missing fonts.mono`).toBeTruthy();
      }
    });

    it("every theme color value is valid hex", () => {
      for (const theme of themes) {
        for (const [name, value] of Object.entries(theme.colors)) {
          expect(value, `Theme "${theme.name}" color "${name}" should be hex`).toMatch(/^#[0-9a-fA-F]{3,8}$/);
        }
      }
    });

    it("default theme (first) matches tokens.ts", () => {
      const defaultTheme = themes[0];
      for (const [name, value] of Object.entries(tokens.colors)) {
        expect(
          defaultTheme.colors[name],
          `Default theme color "${name}" doesn't match tokens.ts`
        ).toBe(value);
      }
    });
  });
});
