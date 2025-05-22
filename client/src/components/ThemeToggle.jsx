"use client"

import { FaSun, FaMoon } from "react-icons/fa"
import { useTheme } from "../contexts/ThemeContext"

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
    </button>
  )
}

export default ThemeToggle
