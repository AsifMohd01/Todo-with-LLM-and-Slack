"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../firebase/config"
import TodoForm from "../components/TodoForm"
import TodoList from "../components/TodoList"
import SummaryGenerator from "../components/SummaryGenerator"
import { FaTasks, FaChartLine, FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa"

const Dashboard = () => {
  const [todoToEdit, setTodoToEdit] = useState(null)
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    highPriority: 0,
    dueSoon: 0,
  })
  const { currentUser } = useAuth()

  useEffect(() => {
    const fetchTodos = async () => {
      if (!currentUser) return

      try {
        const q = query(collection(db, "todos"), where("userId", "==", currentUser.uid))

        const querySnapshot = await getDocs(q)
        const todoList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setTodos(todoList)

        // Calculate stats
        const completed = todoList.filter((todo) => todo.completed).length
        const highPriority = todoList.filter((todo) => todo.priority === "high" && !todo.completed).length

        // Calculate tasks due soon (within next 3 days)
        const today = new Date()
        const threeDaysFromNow = new Date(today)
        threeDaysFromNow.setDate(today.getDate() + 3)

        const dueSoon = todoList.filter((todo) => {
          if (!todo.dueDate || todo.completed) return false
          const dueDate = new Date(todo.dueDate)
          return dueDate >= today && dueDate <= threeDaysFromNow
        }).length

        setStats({
          total: todoList.length,
          completed,
          active: todoList.length - completed,
          highPriority,
          dueSoon,
        })

        setLoading(false)
      } catch (error) {
        console.error("Error fetching todos: ", error)
        setLoading(false)
      }
    }

    fetchTodos()
  }, [currentUser, refreshTrigger])

  const handleFormSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          <FaTasks className="header-icon" />
          My Todo Dashboard
        </h1>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaTasks />
          </div>
          <div className="stat-content">
            <h3>Total Tasks</h3>
            <p>{stats.total}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>Active Tasks</h3>
            <p>{stats.active}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon high-priority">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>High Priority</h3>
            <p>{stats.highPriority}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon due-soon" style={{ backgroundColor: "#3b82f6" }}>
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <h3>Due Soon</h3>
            <p>{stats.dueSoon}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="left-panel">
          <TodoForm todoToEdit={todoToEdit} setTodoToEdit={setTodoToEdit} onSuccess={handleFormSuccess} />

          <SummaryGenerator todos={todos} />
        </div>

        <div className="right-panel">
          <TodoList onEdit={setTodoToEdit} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
