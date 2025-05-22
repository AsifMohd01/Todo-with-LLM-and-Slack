const { db, admin } = require("../config/db")

// Get all todos for a user
const getTodos = async (req, res, next) => {
  try {
    const userId = req.query.userId

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" })
    }

    const todosSnapshot = await db.collection("todos").where("userId", "==", userId).get()

    const todos = []
    todosSnapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    res.json(todos)
  } catch (error) {
    next(error)
  }
}

// Create a new todo
const createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, userId } = req.body

    if (!title || !userId) {
      return res.status(400).json({ error: "Title and user ID are required" })
    }

    const todoRef = await db.collection("todos").add({
      title,
      description: description || "",
      priority: priority || "medium",
      dueDate: dueDate || null,
      completed: false,
      userId,
      createdAt: Date.now(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    const todoDoc = await todoRef.get()

    res.status(201).json({
      id: todoRef.id,
      ...todoDoc.data(),
    })
  } catch (error) {
    next(error)
  }
}

// Update a todo
const updateTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id
    const updateData = req.body

    // Add updatedAt timestamp
    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp()

    await db.collection("todos").doc(todoId).update(updateData)

    const updatedTodoDoc = await db.collection("todos").doc(todoId).get()

    res.json({
      id: todoId,
      ...updatedTodoDoc.data(),
    })
  } catch (error) {
    next(error)
  }
}

// Delete a todo
const deleteTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id

    await db.collection("todos").doc(todoId).delete()

    res.json({ message: "Todo deleted successfully" })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
}
