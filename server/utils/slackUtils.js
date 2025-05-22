// Format message for Slack
const formatSlackMessage = (summary, email) => {
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📋 Todo Summary",
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Generated for:* ${email}`,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: summary,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Generated on ${new Date().toLocaleString()}`,
          },
        ],
      },
    ],
  }
}

module.exports = {
  formatSlackMessage,
}
