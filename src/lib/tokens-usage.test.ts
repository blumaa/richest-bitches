import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, join } from "path";

/**
 * Scans all .tsx files for color classes that don't use semantic tokens.
 * This prevents hardcoded Tailwind colors (gray-800, yellow-400, etc.)
 * from sneaking back in — everything must go through design tokens.
 */

const ALLOWED_COLORS = [
  // Semantic tokens from our design system
  "brand", "brand-hover", "brand-active", "brand-subtle", "brand-foreground",
  "surface", "surface-raised", "surface-overlay",
  "border",
  "primary", "secondary", "muted",
  "error", "success",
  // Rank tokens
  "gold", "gold-light", "silver", "bronze",
  // Standard Tailwind — only transparent/current/inherit allowed
  "transparent", "current", "inherit",
  // Semantic colors not in our token system (acceptable)
  "red-400", "green-400",
];

function getAllTsxFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...getAllTsxFiles(full));
    } else if (full.endsWith(".tsx") && !full.includes(".test.")) {
      files.push(full);
    }
  }
  return files;
}

function extractColorClasses(content: string): string[] {
  const matches: string[] = [];
  // Match bg-*, text-*, border-*, ring-*, placeholder-* color utilities
  const regex = /(?:bg|text|border|ring|placeholder|from|via|to)-([a-z]+-\d+|[a-z]+(?:-[a-z]+)*)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const color = match[1];
    // Skip non-color utilities (sizing, positioning, etc.)
    if (["none", "auto", "clip", "transparent", "center", "left", "right", "sm", "lg", "xl", "2xl", "xs", "base", "wrap", "nowrap", "ellipsis", "pretty", "balance", "t"].includes(color)) continue;
    if (color.length <= 1) continue; // single letter false positives
    if (color.startsWith("[")) continue; // arbitrary values
    matches.push(color);
  }
  return matches;
}

describe("Token usage in components", () => {
  const srcDir = resolve(__dirname, "../app");
  const componentDir = resolve(__dirname, "../components");

  const allFiles = [
    ...getAllTsxFiles(srcDir),
    ...((() => { try { return getAllTsxFiles(componentDir); } catch { return []; } })()),
  ];

  it("found tsx files to scan", () => {
    expect(allFiles.length).toBeGreaterThan(0);
  });

  for (const file of allFiles) {
    const relativePath = file.replace(resolve(__dirname, "../"), "");

    it(`${relativePath} uses only semantic token colors`, () => {
      const content = readFileSync(file, "utf-8");
      const colorClasses = extractColorClasses(content);

      const violations: string[] = [];
      for (const color of colorClasses) {
        const isAllowed = ALLOWED_COLORS.some(
          (allowed) => color === allowed || color.startsWith(allowed + "/")
        );
        if (!isAllowed) {
          violations.push(color);
        }
      }

      expect(
        violations,
        `Found non-token colors: ${[...new Set(violations)].join(", ")}`
      ).toEqual([]);
    });
  }
});
