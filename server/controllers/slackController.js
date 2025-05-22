const { db, admin } = require("../config/db")
const axios = require("axios")
const { formatSlackMessage } = require("../utils/slackUtils")

// Send summary to Slack
const sendToSlack = async (req, res, next) => {
  try {
    const { summary, userId, email } = req.body

    if (!summary) {
      return res.status(400).json({ error: "Summary is required" })
    }

    // Send to Slack using webhook
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL

    if (!slackWebhookUrl) {
      return res.status(500).json({ error: "Slack webhook URL not configured" })
    }

    const message = formatSlackMessage(summary, email)

    await axios.post(slackWebhookUrl, message)

    // Log the Slack message to the database
    await db.collection("slackMessages").add({
      userId,
      summary,
      email,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    res.json({ success: true, message: "Summary sent to Slack successfully" })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  sendToSlack,
}
