"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { FaTasks, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa"
import toast from "react-hot-toast"
// Import the ThemeToggle component
import ThemeToggle from "./ThemeToggle"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
      navigate("/login")
    } catch (error) {
      toast.error("Failed to log out")
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaTasks className="logo-icon" />
          <span>TodoSummary</span>
        </Link>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <ThemeToggle />
          </li>
          {currentUser ? (
            <>
              <li className="nav-item">
                <span className="nav-username">{currentUser.email}</span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-button">
                  <FaSignOutAlt className="nav-icon" />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
