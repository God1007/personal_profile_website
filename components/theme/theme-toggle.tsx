"use client";

import { useOptionalTheme } from "@/components/theme/theme-provider";

type ThemeToggleProps = {
  initialTheme?: "light" | "dark";
  onToggle?: () => void;
};

export function ThemeToggle({ initialTheme, onToggle }: ThemeToggleProps) {
  const themeContext = useOptionalTheme();

  if (initialTheme && onToggle) {
    return (
      <button type="button" aria-label="Toggle theme" onClick={onToggle} className="theme-toggle">
        {initialTheme}
      </button>
    );
  }

  if (!themeContext) {
    return (
      <button type="button" aria-label="Toggle theme" className="theme-toggle">
        Light
      </button>
    );
  }

  const { theme, toggleTheme } = themeContext;

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="theme-toggle"
    >
      {theme === "light" ? "Light" : "Dark"}
    </button>
  );
}
