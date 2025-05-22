"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"
import "./App.css"
// Import ThemeProvider
import { ThemeProvider } from "./contexts/ThemeContext"

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  return children
}

// Wrap the entire app with ThemeProvider
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
