"use client";

import { useState } from "react";
import { themes } from "@/lib/themes";

export function ThemeSwitcher() {
  const [currentIndex, setCurrentIndex] = useState(0);

  function cycleTheme() {
    const nextIndex = (currentIndex + 1) % themes.length;
    setCurrentIndex(nextIndex);
    document.documentElement.setAttribute(
      "data-theme",
      themes[nextIndex].name.toLowerCase()
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className="fixed bottom-4 right-4 z-50 px-3 py-2 rounded-md bg-surface-raised border border-border text-primary text-xs font-medium hover:bg-surface-overlay transition-colors"
    >
      Theme: {themes[currentIndex].name}
    </button>
  );
}
