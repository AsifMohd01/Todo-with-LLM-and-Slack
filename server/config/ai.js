const { GoogleGenerativeAI } = require("@google/generative-ai")
const dotenv = require("dotenv")

dotenv.config()

// Initialize Gemini AI
const initializeAI = () => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("Warning: GEMINI_API_KEY environment variable is not set.")
      console.warn("AI summarization features will not work correctly.")

      // Return a mock AI in development
      if (process.env.NODE_ENV !== "production") {
        return {
          getGenerativeModel: () => ({
            generateContent: async () => ({
              response: {
                text: () => "This is a mock AI response. Please set GEMINI_API_KEY to enable real AI summarization.",
              },
            }),
          }),
        }
      } else {
        throw new Error("GEMINI_API_KEY is required in production mode")
      }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    return genAI
  } catch (error) {
    console.error("Error initializing Gemini AI:", error.message)

    if (process.env.NODE_ENV === "production") {
      throw error
    } else {
      console.warn("Running in development mode with mock AI responses")
      // Return a mock AI for development
      return {
        getGenerativeModel: () => ({
          generateContent: async () => ({
            response: {
              text: () => "This is a mock AI response. Please check your Gemini API configuration.",
            },
          }),
        }),
      }
    }
  }
}

const genAI = initializeAI()

module.exports = { genAI }
