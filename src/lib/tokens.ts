/**
 * Design tokens — single source of truth.
 * These values MUST match what's in globals.css.
 * Tests verify both sides stay in sync.
 */
export const tokens = {
  colors: {
    brand: "#18E299",
    "brand-hover": "#0fa76e",
    "brand-active": "#0d8f5e",
    "brand-foreground": "#0d0d0d",
    surface: "#ffffff",
    "surface-raised": "#fafafa",
    "surface-overlay": "#f5f5f5",
    border: "#e5e5e5",
    primary: "#0d0d0d",
    secondary: "#333333",
    muted: "#888888",
    error: "#f87171",
    success: "#4ade80",
    gold: "#FFD700",
    "gold-light": "#b8960b",
    silver: "#777777",
    bronze: "#8b5e20",
  },
  typography: {
    "heading-weight": "600",
    "heading-tracking": "-0.02em",
    "heading-leading": "1.15",
    "body-leading": "1.5",
  },
  radius: {
    sm: "8px",
    md: "16px",
    lg: "24px",
  },
} as const;

export type TokenColor = keyof typeof tokens.colors;
