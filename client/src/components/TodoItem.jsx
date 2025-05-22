"use client"

import { useState } from "react"
import { FaEdit, FaTrash, FaClock, FaFlag, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { formatDistanceToNow } from "date-fns"

const TodoItem = ({ todo, onDelete, onToggleComplete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "var(--priority-high)"
      case "medium":
        return "var(--priority-medium)"
      case "low":
        return "var(--priority-low)"
      default:
        return "var(--priority-medium)"
    }
  }

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null

    const date = new Date(dueDate)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString()
    }
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    const date = new Date(dueDate)
    const today = new Date()
    return date < today && !todo.completed
  }

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return ""
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  return (
    <div
      className={`todo-item ${todo.completed ? "completed" : ""} ${isOverdue(todo.dueDate) ? "overdue" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="todo-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="todo-checkbox-container">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id, todo.completed)}
            className="todo-checkbox"
            id={`todo-${todo.id}`}
          />
          <label htmlFor={`todo-${todo.id}`} className="todo-checkbox-label"></label>
        </div>

        <div className="todo-content">
          <h3 className="todo-title">{todo.title}</h3>

          <div className="todo-meta">
            {todo.dueDate && (
              <span className={`todo-due-date ${isOverdue(todo.dueDate) ? "overdue" : ""}`}>
                <FaClock className="todo-icon" />
                {formatDueDate(todo.dueDate)}
              </span>
            )}

            <span className="todo-priority" style={{ backgroundColor: getPriorityColor(todo.priority) }}>
              <FaFlag className="todo-icon" />
              {todo.priority}
            </span>

            <span className="todo-created">{getTimeAgo(todo.createdAt)}</span>
          </div>
        </div>

        <div className="todo-actions">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(todo)
            }}
            className="todo-action-btn edit"
            aria-label="Edit todo"
          >
            <FaEdit />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(todo.id)
            }}
            className="todo-action-btn delete"
            aria-label="Delete todo"
          >
            <FaTrash />
          </button>
          {todo.description && (
            <button
              className="todo-action-btn expand"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              aria-label={isExpanded ? "Collapse description" : "Expand description"}
            >
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          )}
        </div>
      </div>

      {isExpanded && todo.description && (
        <div className="todo-description">
          <p>{todo.description}</p>
        </div>
      )}
    </div>
  )
}

export default TodoItem
