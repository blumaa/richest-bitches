"use client";

import { themes } from "@/lib/themes";

const fontVarMap: Record<string, string> = {
  "Inter": "var(--font-inter)",
  "Space Grotesk": "var(--font-space-grotesk)",
  "IBM Plex Sans": "var(--font-ibm-plex-sans)",
  "IBM Plex Mono": "var(--font-ibm-plex-mono)",
  "DM Sans": "var(--font-dm-sans)",
  "Geist Mono": "var(--font-geist-mono)",
  "JetBrains Mono": "var(--font-jetbrains-mono)",
  "Poppins": "var(--font-poppins)",
  "Lora": "var(--font-lora)",
  "Source Code Pro": "var(--font-source-code-pro)",
  "Azeret Mono": "var(--font-azeret-mono)",
};

function generateThemeCSS(): string {
  return themes.map((theme) => {
    const selector = theme.name === themes[0].name
      ? `:root, [data-theme="${theme.name.toLowerCase()}"]`
      : `[data-theme="${theme.name.toLowerCase()}"]`;

    const fontHeading = fontVarMap[theme.fonts.heading] ?? "var(--font-inter)";
    const fontBody = fontVarMap[theme.fonts.body] ?? "var(--font-inter)";
    const fontMono = fontVarMap[theme.fonts.mono] ?? "var(--font-geist-mono)";

    const colorVars = Object.entries(theme.colors)
      .map(([key, value]) => `--app-${key}: ${value};`)
      .join("\n  ");

    return `${selector} {
  --app-font-heading: ${fontHeading};
  --app-font-body: ${fontBody};
  --app-font-mono: ${fontMono};
  --app-heading-weight: ${theme.typography["heading-weight"]};
  --app-heading-tracking: ${theme.typography["heading-tracking"]};
  --app-heading-leading: ${theme.typography["heading-leading"]};
  --app-body-leading: ${theme.typography["body-leading"]};
  --app-radius-sm: ${theme.radius.sm};
  --app-radius-md: ${theme.radius.md};
  --app-radius-lg: ${theme.radius.lg};
  ${colorVars}
}`;
  }).join("\n\n");
}

const themeCSS = generateThemeCSS();

export function ThemeStyles() {
  return <style dangerouslySetInnerHTML={{ __html: themeCSS }} />;
}
