const express = require("express")
const router = express.Router()
const { sendToSlack } = require("../controllers/slackController")

// Slack routes
router.post("/", sendToSlack)

module.exports = router
