"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      return savedTheme === "dark"
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  useEffect(() => {
    // Update document class and local storage when theme changes
    if (darkMode) {
      document.documentElement.classList.add("dark-mode")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark-mode")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode)
  }

  const value = {
    darkMode,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
