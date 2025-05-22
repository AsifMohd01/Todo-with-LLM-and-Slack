"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/config"
import { FaTimes, FaSave, FaPlus, FaCalendarAlt } from "react-icons/fa"
import toast from "react-hot-toast"

const TodoForm = ({ todoToEdit, setTodoToEdit, onSuccess }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [dueDate, setDueDate] = useState("")
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()

  useEffect(() => {
    if (todoToEdit) {
      setTitle(todoToEdit.title || "")
      setDescription(todoToEdit.description || "")
      setPriority(todoToEdit.priority || "medium")
      setDueDate(todoToEdit.dueDate ? new Date(todoToEdit.dueDate).toISOString().split("T")[0] : "")
    } else {
      resetForm()
    }
  }, [todoToEdit])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setPriority("medium")
    setDueDate("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Title is required")
      return
    }

    if (!currentUser) {
      toast.error("You must be logged in")
      return
    }

    try {
      setLoading(true)

      if (todoToEdit) {
        // Update existing todo
        await updateDoc(doc(db, "todos", todoToEdit.id), {
          title,
          description,
          priority,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          updatedAt: serverTimestamp(),
        })

        toast.success("Todo updated successfully")
        setTodoToEdit(null)
      } else {
        // Add new todo
        await addDoc(collection(db, "todos"), {
          title,
          description,
          priority,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          completed: false,
          userId: currentUser.uid,
          createdAt: Date.now(),
          updatedAt: serverTimestamp(),
        })

        toast.success("Todo added successfully")
      }

      resetForm()
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error saving todo: ", error)
      toast.error(todoToEdit ? "Failed to update todo" : "Failed to add todo")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setTodoToEdit(null)
    resetForm()
  }

  return (
    <div className="todo-form-container">
      <h2 className="form-title">{todoToEdit ? "Edit Todo" : "Add New Todo"}</h2>

      <form onSubmit={handleSubmit} className="todo-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about this task..."
            rows="3"
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">
              <FaCalendarAlt className="input-icon" />
              Due Date (optional)
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div className="form-actions">
          {todoToEdit && (
            <button type="button" onClick={handleCancel} className="cancel-button" disabled={loading}>
              <FaTimes className="button-icon" />
              Cancel
            </button>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              "Saving..."
            ) : (
              <>
                {todoToEdit ? (
                  <>
                    <FaSave className="button-icon" />
                    Update
                  </>
                ) : (
                  <>
                    <FaPlus className="button-icon" />
                    Add Todo
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TodoForm
