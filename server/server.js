const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const { errorHandler } = require("./middleware/errorHandler")
const { db } = require("./config/db") // Import db from config instead of initializing here

// Import routes
const todoRoutes = require("./routes/todoRoutes")
const summaryRoutes = require("./routes/summaryRoutes")
const slackRoutes = require("./routes/slackRoutes")

// Load environment variables
dotenv.config()

// Initialize Express
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/todos", todoRoutes)
app.use("/api/summarize", summaryRoutes)
app.use("/api/slack", slackRoutes)

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
