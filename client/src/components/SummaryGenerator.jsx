"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { FaRobot, FaSlack, FaSpinner, FaCopy, FaCheck } from "react-icons/fa"
import toast from "react-hot-toast"

const SummaryGenerator = ({ todos }) => {
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [slackSending, setSlackSending] = useState(false)
  const [slackSuccess, setSlackSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const { currentUser } = useAuth()

  const activeTodos = todos.filter((todo) => !todo.completed)

  // Simulate progress during generation
  useEffect(() => {
    let interval
    if (loading) {
      setGenerationProgress(0)
      interval = setInterval(() => {
        setGenerationProgress((prev) => {
          const newProgress = prev + Math.random() * 15
          return newProgress > 90 ? 90 : newProgress
        })
      }, 300)
    } else if (generationProgress > 0) {
      setGenerationProgress(100)
      setTimeout(() => setGenerationProgress(0), 1000)
    }

    return () => clearInterval(interval)
  }, [loading])

  const generateSummary = async () => {
    if (activeTodos.length === 0) {
      toast.error("No active todos to summarize")
      return
    }

    try {
      setLoading(true)
      setSummary("")
      setSlackSuccess(false)
      setCopied(false)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todos: activeTodos,
          userId: currentUser.uid,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate summary")
      }

      const data = await response.json()
      setSummary(data.summary)
      toast.success("Summary generated successfully")
    } catch (error) {
      console.error("Error generating summary:", error)
      toast.error("Failed to generate summary")
    } finally {
      setLoading(false)
    }
  }

  const sendToSlack = async () => {
    if (!summary) {
      toast.error("Generate a summary first")
      return
    }

    try {
      setSlackSending(true)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/slack`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary,
          userId: currentUser.uid,
          email: currentUser.email,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send to Slack")
      }

      setSlackSuccess(true)
      toast.success("Summary sent to Slack successfully")
    } catch (error) {
      console.error("Error sending to Slack:", error)
      toast.error("Failed to send to Slack")
    } finally {
      setSlackSending(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(summary)
      .then(() => {
        setCopied(true)
        toast.success("Summary copied to clipboard")
        setTimeout(() => setCopied(false), 3000)
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard")
      })
  }

  return (
    <div className="summary-container">
      <div className="summary-header">
        <h2>
          <FaRobot className="summary-icon" />
          AI Todo Summary
        </h2>
        <p>Generate an AI-powered summary of your active todos and send it to Slack</p>
      </div>

      {loading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${generationProgress}%` }}></div>
          </div>
          <p className="progress-text">Generating summary... {Math.round(generationProgress)}%</p>
        </div>
      )}

      <div className="summary-actions">
        <button onClick={generateSummary} disabled={loading || activeTodos.length === 0} className="generate-button">
          {loading ? (
            <>
              <FaSpinner className="spinner" />
              Generating...
            </>
          ) : (
            "Generate Summary"
          )}
        </button>

        <button
          onClick={sendToSlack}
          disabled={!summary || slackSending}
          className={`slack-button ${slackSuccess ? "success" : ""}`}
        >
          {slackSending ? (
            <>
              <FaSpinner className="spinner" />
              Sending...
            </>
          ) : (
            <>
              <FaSlack className="button-icon" />
              {slackSuccess ? "Sent to Slack!" : "Send to Slack"}
            </>
          )}
        </button>
      </div>

      {summary && (
        <div className="summary-result">
          <div className="summary-result-header">
            <h3>Summary</h3>
            <button onClick={copyToClipboard} className="copy-button" aria-label="Copy summary to clipboard">
              {copied ? <FaCheck /> : <FaCopy />}
            </button>
          </div>
          <div className="summary-text">
            {summary.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {activeTodos.length === 0 && (
        <div className="empty-summary">
          <img src="/images/completed-tasks.svg" alt="All tasks completed" className="empty-image" />
          <p>No active todos to summarize. Great job!</p>
        </div>
      )}
    </div>
  )
}

export default SummaryGenerator
