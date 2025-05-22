"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import TodoItem from "./TodoItem"
import { FaSort, FaFilter } from "react-icons/fa"
import toast from "react-hot-toast"

const TodoList = ({ onEdit, refreshTrigger }) => {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [filter, setFilter] = useState("all")
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) return

    const q = query(collection(db, "todos"), where("userId", "==", currentUser.uid))

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const todoList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setTodos(todoList)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching todos: ", error)
        toast.error("Failed to load todos")
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [currentUser, refreshTrigger])

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id))
      toast.success("Todo deleted successfully")
    } catch (error) {
      console.error("Error deleting todo: ", error)
      toast.error("Failed to delete todo")
    }
  }

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, "todos", id), {
        completed: !currentStatus,
      })
      toast.success(`Todo marked as ${!currentStatus ? "completed" : "incomplete"}`)
    } catch (error) {
      console.error("Error updating todo: ", error)
      toast.error("Failed to update todo status")
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedTodos = [...todos]
    .filter((todo) => {
      if (filter === "all") return true
      if (filter === "active") return !todo.completed
      if (filter === "completed") return todo.completed
      return true
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return sortDirection === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority]
      } else if (sortBy === "dueDate") {
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date(0)
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date(0)
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      } else {
        // Default sort by createdAt
        return sortDirection === "asc" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt
      }
    })

  if (loading) {
    return <div className="loading-spinner"></div>
  }

  return (
    <div className="todo-list-container">
      <div className="todo-controls">
        <div className="todo-filters">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="sort-group">
            <FaSort className="sort-icon" />
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split("-")
                setSortBy(field)
                setSortDirection(direction)
              }}
              className="sort-select"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="priority-desc">Priority (High-Low)</option>
              <option value="priority-asc">Priority (Low-High)</option>
              <option value="dueDate-asc">Due Date (Earliest)</option>
              <option value="dueDate-desc">Due Date (Latest)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSortedTodos.length === 0 ? (
        <div className="empty-state">
          <img src="/images/empty-todos.svg" alt="No todos" className="empty-image" />
          <h3>No todos found</h3>
          <p>
            {filter === "all"
              ? "Add your first todo to get started!"
              : filter === "active"
                ? "No active todos. Great job!"
                : "No completed todos yet."}
          </p>
        </div>
      ) : (
        <div className="todo-items">
          {filteredAndSortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TodoList
