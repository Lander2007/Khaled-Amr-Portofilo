"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemePolarity = "milk" | "plum";

interface ThemeContextType {
  theme: ThemePolarity;
  isPlum: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemePolarity) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "portfolio-polarity-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePolarity>("milk");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initialTheme: ThemePolarity = "milk";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemePolarity | null;
      if (stored === "milk" || stored === "plum") {
        initialTheme = stored;
      }
    } catch {
      // Local storage unavailable
    }

    setThemeState(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    setMounted(true);
  }, []);

  const setTheme = (newTheme: ThemePolarity) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Local storage unavailable
    }
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleTheme = () => {
    const next = theme === "milk" ? "plum" : "milk";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isPlum: theme === "plum",
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Graceful fallback for components rendered outside provider
    return {
      theme: "milk" as ThemePolarity,
      isPlum: false,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}

