const { db, admin } = require("../config/db")
const { genAI } = require("../config/ai")
const { formatTodosForAI } = require("../utils/aiUtils")

// Generate a summary of todos
const generateSummary = async (req, res, next) => {
  try {
    const { todos, userId } = req.body

    if (!todos || !Array.isArray(todos) || todos.length === 0) {
      return res.status(400).json({ error: "Valid todos array is required" })
    }

    // Format todos for the AI prompt
    const todosList = formatTodosForAI(todos)

    // Create the prompt for Gemini
    const prompt = `
      You are a helpful assistant that summarizes todo lists. Please provide a concise summary of the following todos:
      
      ${todosList}
      
      Please include:
      1. A brief overview of the tasks
      2. Highlight any high priority items
      3. Mention any upcoming deadlines
      4. Group similar tasks if possible
      5. Keep the summary professional and actionable
    `

    // Generate summary with Gemini
    const model = genAI.getGenerativeModel({  model: "models/gemini-1.5-flash"})
    const result = await model.generateContent(prompt)
    const summary = result.response.text()

    // Save the summary to the database
    await db.collection("summaries").add({
      userId,
      todos: todos.map((todo) => ({ id: todo.id, title: todo.title })),
      summary,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    res.json({ summary })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  generateSummary,
}
