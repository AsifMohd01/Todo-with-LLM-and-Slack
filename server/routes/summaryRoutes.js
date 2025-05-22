const express = require("express")
const router = express.Router()
const { generateSummary } = require("../controllers/summaryController")

// Summary routes
router.post("/", generateSummary)

module.exports = router
